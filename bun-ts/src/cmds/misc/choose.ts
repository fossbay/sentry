import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction, ColorResolvable } from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Choose a random option!')
    .addStringOption((option) =>
        option
            .setName('options')
            .setDescription('options, separated by comma')
            .setRequired(true),
    )
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('How many options to choose')
            .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    // get all options
    const options = interaction.options
        .getString('options')
        ?.split(',') as string[];
    // get the amount of options to choose
    const amount = interaction.options.getInteger('amount') || 1;

    const chosen = [];
    // choose a random option
    for (let i = 0; i < amount; i++) {
        chosen.push(options[Math.floor(Math.random() * options.length)]);
    }
    // reply to the interaction
    const embed = new EmbedBuilder()
        .setColor(util.colors.primary as ColorResolvable)
        .addFields({
            name: 'choices',
            value: options.join(', '),
            inline: true,
        })
        .addFields({
            name: 'chosen',
            value: chosen.join(', '),
            inline: true,
        })
        .setTimestamp(new Date())
        .setFooter({
            text: `requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL() as string,
        });

    await interaction.reply({
        embeds: [embed],
    });
}
