import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('log')
    .setDescription('Log a message to the console!')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('What you want to log')
            .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
 
export async function execute(interaction: ChatInputCommandInteraction) {
    if (!util.isOwner(interaction.user.id)) {
        return await interaction.reply({
            content: 'You are not the owner of this bot!',
            ephemeral: true,
        });
    }

    const message = interaction.options.getString('message');
    console.log(message);
    await interaction.reply({
        content: `Logged \`${message}\` to the console!`,
        ephemeral: true,
    });
}
