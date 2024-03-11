import {
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';

import { evaluate, format } from 'mathjs';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('math')
    .setDescription('Replies with math!')
    .addStringOption((option) =>
        option
            .setName('equation')
            .setDescription(
                'see https://mathjs.org/docs/expressions/syntax.html',
            )
            .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const equation = interaction.options.getString('equation') || '0';

    let result: string;
    try {
        result = evaluate(equation);
        result = format(result, { precision: 3 });
    } catch (error) {
        const errEmbed = new EmbedBuilder()
            .setColor(util.colors.error as ColorResolvable)
            .setTitle('error')
            .setDescription(error.message)
            .setTimestamp(new Date())
            .setFooter({
                text: `requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL() as string,
            });

        return await interaction.reply({
            embeds: [errEmbed],
            ephemeral: true,
        });
    }

    const embed = new EmbedBuilder()
        .setColor(util.colors.primary as ColorResolvable)
        .addFields({
            name: 'equation',
            value: `${equation}`,
            inline: true,
        })
        .addFields({
            name: 'result',
            value: `${result}`,
            inline: true,
        })
        .setTimestamp(new Date())
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL() as string,
        });

    // await interaction.reply(`\`${equation}\` = \`${result}\``);

    await interaction.reply({
        embeds: [embed],
    });
}
