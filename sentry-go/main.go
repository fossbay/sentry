package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/bwmarrin/discordgo"

	_ "github.com/joho/godotenv/autoload"
)

var (
	Token   string = os.Getenv("BOT_TOKEN")
	OwnerID string = os.Getenv("OWNER_ID")
	GuildID string = os.Getenv("GUILD_ID")
)

func main() {
	// Create a new Discord session using the provided bot token.
	dg, err := discordgo.New("Bot " + Token)
	if err != nil {
		fmt.Println("error creating Discord session,", err)
		return
	}

	// Register the messageCreate func as a callback for MessageCreate events.
	dg.AddHandler(messageCreate)

	// In this example, we only care about receiving message events.
	dg.Identify.Intents = discordgo.IntentsGuildMessages

	// Open a websocket connection to Discord and begin listening.
	err = dg.Open()
	if err != nil {
		fmt.Println("error opening connection,", err)
		return
	}

	// Wait here until CTRL-C or other term signal is received.
	fmt.Println("Bot is now running.  Press CTRL-C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-sc

	// Cleanly close down the Discord session.
	dg.Close()
}

// This function will be called (due to AddHandler above) every time a new
// message is created on any channel that the authenticated bot has access to.
func messageCreate(s *discordgo.Session, m *discordgo.MessageCreate) {

	// Ignore all messages created by the bot itself
	// This isn't required in this specific example but it's a good practice.
	if m.Author.ID == s.State.User.ID {
		return
	}
	// If the message is "ping" reply with "Pong!"
	if m.Content == "ping" {
		latency := s.HeartbeatLatency().Seconds() * 1000
		s.ChannelMessageSend(m.ChannelID, "Pong! "+fmt.Sprintf("%.f", latency)+"ms")
	}

	// If the message is "pong" reply with "Ping!"
	if m.Content == "pong" {
		s.ChannelMessageSend(m.ChannelID, "Ping!")
	}

	// clear the chat
	if m.Content == "clear" {
		ids := []string{}
		msgs, _ := s.ChannelMessages(m.ChannelID, 5, "", "", "")
		for _, msg := range msgs {
			ids = append(ids, msg.ID)
		}
		err := s.ChannelMessagesBulkDelete(m.ChannelID, ids)
		if err != nil {
			s.ChannelMessageSend(m.ChannelID, "Error: "+err.Error())
			return
		}
		s.ChannelMessageSend(m.ChannelID, "Chat Cleared!")
	}

	// Ban Gabry
	if m.Content == "ban" {
		s.GuildBanCreate(m.GuildID, "948242943595147325", 0)
		s.ChannelMessageSend(m.ChannelID, "Gabry Banned!")
	}

	// Unban Gabry
	if m.Content == "unban" {
		s.GuildBanDelete(m.GuildID, "948242943595147325")
		s.ChannelMessageSend(m.ChannelID, "Gabry Unbanned!")
	}

	// generate a random number
	// command: rand <min> <max> <precision>
	// assume min, max, and result are floats; aka don't cast to int
	// reply: min:<min> and max:<max> -> <result>
	if m.Content == "rand" {
		s.ChannelMessageSend(m.ChannelID, "Usage: rand <min> <max> <precision>")
	}
	if len(m.Content) > 5 && m.Content[:4] == "rand" {
		var min, max float64
		var precision int
		_, err := fmt.Sscanf(m.Content, "rand %f %f %d", &min, &max, &precision)
		if err != nil {
			s.ChannelMessageSend(m.ChannelID, "Error: "+err.Error())
			return
		}
		result := rand.Float64()*(max-min) + min
		s.ChannelMessageSend(m.ChannelID, fmt.Sprintf("min:%f and max:%f -> %.*f", min, max, precision, result))
	}

	// say command (message is the rest of the string)
	// command: say <target> <message>
	// reply: Embed with message and target
	if m.Content == "say" {
		s.ChannelMessageSend(m.ChannelID, "Usage: say <target> <message>")
	}
	if len(m.Content) > 4 && m.Content[:3] == "say" {
		target, message := "", ""
		parts := strings.SplitN(m.Content, " ", 3)
		if len(parts) == 3 {
			target = parts[1]
			message = parts[2]
		}

		s.ChannelMessageSendEmbed(m.ChannelID, &discordgo.MessageEmbed{
			Title:       "Message from " + m.Author.Username,
			Description: message,
			Footer: &discordgo.MessageEmbedFooter{
				Text: "To " + target,
			},
		})
	}

	// nice command
	// command: nice
	// reply: no, you're nice :)
	if m.Content == "nice" {
		// if author is owner of bot, reply with "no, you're nice :)"
		if m.Author.ID == OwnerID {
			s.ChannelMessageSend(m.ChannelID, "no, you're nice :)")
		} else {
			s.ChannelMessageSend(m.ChannelID, "haha, no")
		}
	}

	// check if user is rich or poor (based on nitro/premium)
	// command: wealth
	// reply: "You are rich" or "You are poor"
	if m.Content == "wealth" {
		if m.Author.PremiumType == 2 || m.Author.ID == OwnerID {
			s.ChannelMessageSend(m.ChannelID, "You are rich")
		} else {
			s.ChannelMessageSend(m.ChannelID, "You are poor")
		}
	}

	// send a random image
	// command: image
	// reply: random image
	if m.Content == "image" {
		url := "https://picsum.photos/200"
		// send a request to the url
		resp, err := http.Get(url)
		if err != nil {
			s.ChannelMessageSend(m.ChannelID, "Error: "+err.Error())
			return
		}
		// send the image
		s.ChannelFileSend(m.ChannelID, "image.jpg", resp.Body)
	}

}
