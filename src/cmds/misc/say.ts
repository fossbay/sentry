import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type {
    ChatInputCommandInteraction,
    ColorResolvable,
    TextChannel,
} from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('say')
    .setDescription('reply with what you say!')
    //@ts-ignore
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('What you want to say')
            .setRequired(true),
    )
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel you want to say it in')
            .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const msg = interaction.options.getString('message', true);
    const channelType =
            interaction.options.getChannel('channel', false) || interaction.channel;
    const channel = interaction.guild?.channels.cache.get(
            channelType?.id as string,
        ) as TextChannel | undefined;
    const embed = new EmbedBuilder()
            .setColor(util.colors.primary as ColorResolvable)
            .addFields({
                name: 'say',
                value: `${msg}`,
                inline: true,
            })
            .setTimestamp(new Date())
            .setFooter({
                text: `requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL() as string,
            });

    await channel?.send({
        embeds: [embed],
    });

    await interaction.reply({
        content: 'Message sent!',
        ephemeral: true,
    });
}
