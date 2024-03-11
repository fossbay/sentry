import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ColorResolvable,
} from 'discord.js';

import util from '../../util';
import { sleep } from 'bun';

export const data = new SlashCommandBuilder()
    .setName('issue')
    .setDescription('Report an issue with the server or bot')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('What issue you are having')
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName('type')
            .setDescription('Suggestions, Issues, Bugs, etc.')
            .setRequired(true)
            .addChoices(
                {
                    name: 'Bug',
                    value: 'bug',
                },
                {
                    name: 'Issue',
                    value: 'issue',
                },
                {
                    name: 'Suggestion',
                    value: 'suggestion',
                },
                {
                    name: 'Other',
                    value: 'other',
                },
            ),
    )
    .addBooleanOption((option) =>
        option
            .setName('anonymous')
            .setDescription(
                'Anonymity cannot be guaranteed; staff can see who sent the issue',
            )
            .setRequired(false),
    )
    .addBooleanOption((option) =>
        option
            .setName('bot')
            .setDescription('Is this for sentry?')
            .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const issue = interaction.options.getString('message', true);
    const type = interaction.options.getString('type', true);
    const anonymous = interaction.options.getBoolean('anonymous', false);
    const forBot = interaction.options.getBoolean('bot', false);

    if (!forBot) {
        const embed = new EmbedBuilder()
            .setColor(util.colors.primary as ColorResolvable)
            .addFields(
                {
                    name: 'Issue',
                    value: `${issue}`,
                    inline: true,
                },
                {
                    name: 'Type',
                    value: `${type}`,
                    inline: true,
                },
            )
            .setTimestamp(new Date())
            .setFooter({
                text: anonymous ? 'Anonymous' : interaction.user.tag,
                iconURL: anonymous
                    ? util.emojis.loading
                    : (interaction.user.displayAvatarURL() as string),
            });

        // get the current channel
        const channel = interaction.channel;

        // send the embed
        await channel?.send({
            embeds: [embed],
        });

        // reply to the user
        await interaction.reply({
            content: 'Issue sent!',
            ephemeral: true,
        });
    } else if (forBot) {
        const author = anonymous ? 'Anonymous' : interaction.user.tag;
        const message = `Issue: ${issue}\nType: ${type}\nAuthor: ${author}\nTime: ${new Date().toUTCString()}\n`;

        console.log(message);

        interaction.reply({
            content: 'Issue sent!',
            ephemeral: true,
        });
    } else {
        await interaction.reply({
            content: 'An error occurred!',
            ephemeral: true,
        });
    }

    // Ask the user if they want to save the issue anonymously
    // If they do, save it to a file

    // Edit the message to say "Would you like to save this issue anonymously?"

    sleep(2000).then(async () => {
        // edit the message and add a button
        interaction.editReply({
            content: 'Would you like to save this issue anonymously?',
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: 'Yes',
                            style: 3,
                            custom_id: 'yes',
                        },
                        {
                            type: 2,
                            label: 'No',
                            style: 4,
                            custom_id: 'no',
                        },
                    ],
                },
            ],
        });
    });

    // wait for the user to click the button
    const collector = interaction.channel?.createMessageComponentCollector({
        time: 1000 * 60 * 5,
    });

    collector?.on('collect', async (i) => {
        if (i.customId === 'yes') {
            // save the issue
            // WIP
            await interaction.editReply({
                content: 'Issue saved!',
                components: [],
            });
        } else if (i.customId === 'no') {
            await interaction.editReply({
                content: 'Issue not saved!',
                components: [],
            });
        }
    });

    collector?.on('end', async (collected) => {
        if (collected.size === 0) {
            await interaction.editReply({
                content: 'Issue not saved!',
                components: [],
            });
        }
    });
}
