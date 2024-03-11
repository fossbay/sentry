import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction, ColorResolvable } from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll!')
    .addStringOption((option) =>
        option
            .setName('choices')
            .setDescription('choices, separated by comma')
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName('title')
            .setDescription('Title of the poll')
            .setRequired(false),
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('Description of the poll')
            .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    let choices = interaction.options
        .getString('choices')
        ?.split(',') as string[];
    const title = interaction.options.getString('title') || 'Poll';
    const description =
        interaction.options.getString('description') || 'No description';

    // send loading message
    const loadingEmbed = new EmbedBuilder()
        .setColor(util.colors.primary as ColorResolvable)
        .setTitle('Loading...')
        .setThumbnail(util.emojis.loading)
        .setTimestamp(new Date())
        .setFooter({
            text: `requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL() as string,
        });

    await interaction.reply({
        embeds: [loadingEmbed],
        ephemeral: true,
    });

    choices.filter((choice) => choice !== '');
    choices.filter((choice, i) => choices.indexOf(choice) === i);
    choices = choices.slice(0, 19);

    // assign emoji letter to each choice
    const emojis = choices.map((_, i) => String.fromCodePoint(0x1f1e6 + i));

    // create the poll
    const embed = new EmbedBuilder()
        .setColor(util.colors.primary as ColorResolvable)
        .setTitle(title)
        .setDescription(description)
        // add choices with emoji
        .addFields(
            choices.map((choice, i) => ({
                name: `${emojis[i]} ${choice}`,
                value: '\u200b',
                inline: true,
            })),
        )
        .setTimestamp(new Date())
        .setFooter({
            text: `requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL() as string,
        });

    // send the poll (standalone message)
    const pollMessage = await interaction.channel?.send({
        embeds: [embed],
    });

    // add reactions to the poll
    for (const emoji of emojis) {
        await pollMessage?.react(emoji);
    }

    // send a confirmation message
    const confirmEmbed = new EmbedBuilder()
        .setColor(util.colors.success as ColorResolvable)
        .addFields({
            name: 'Poll created!',
            value: `${title}`,
            inline: true,
        })
        .setTimestamp(new Date())
        .setFooter({
            text: `requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL() as string,
        });

    await interaction.editReply({
        embeds: [confirmEmbed],
    });
}
