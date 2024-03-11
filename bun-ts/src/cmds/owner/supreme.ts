import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('supreme')
    .setDescription('says who is supreme!')
    .addStringOption((option) =>
        option
            .setName('message')
            .setDescription('What you want to say')
            .setRequired(true),
    )
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription('The user to send the message to')
            .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    
export async function execute(interaction: ChatInputCommandInteraction) {
    // check if the user is owner of the bot
    if (!util.isOwner(interaction.user.id)) {
        return await interaction.reply({
            content: 'You are not the owner of this bot!',
            ephemeral: true,
        });
    }

    const message = interaction.options.getString('message');
    const user = interaction.options.getUser('user');
    // dm the user
    await user.send(message);
    // reply to the interaction
    await interaction.reply(`Sent ${message} to ${user.username}`);
}
