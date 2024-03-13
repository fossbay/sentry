import discord

def start() -> None:
    # intents = discord.Intents.default()
    intents = discord.Intents(messages=True, guilds=True, reactions=True, members=True, presences=True)

    # Create a new bot
    bot = discord.Client(intents=intents)

    # Define an event
    @bot.event
    async def on_ready() -> None:
        print(f'Logged in as {bot.user}')