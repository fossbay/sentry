import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('spam')
    .setDescription('spam random messages!')
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('How many messages to spam')
            .setRequired(true),
    )
    .addBooleanOption((option) =>
        option
            .setName('delete')
            .setDescription('Whether to delete after send')
            .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
    // owner of the bot only
    if (!util.isOwner(interaction.user.id)) {
        return await interaction.reply({
            content: 'You are not the owner of this bot!',
            ephemeral: true,
        });
    }

    const amount = interaction.options.getInteger('amount');
    if (amount <= 0) {
        await interaction.reply('Amount must be greater than 0!');
        return;
    } else if (amount > 99) {
        await interaction.reply('Amount must be less than 100!');
        return;
    }

    // generate random messages
    const messages = [];
    for (let i = 0; i < amount; i++) {
        messages.push(Math.random().toString(36).substring(2, 15));
    }
    // send the messages in separate messages
    for (let i = 0; i < messages.length; i++) {
        // wait 1 second before sending the next message to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await interaction.channel.send(messages[i]);
    }

    const deleteAfter = interaction.options.getBoolean('delete');

    if (deleteAfter) {
        // delete the messages after waiting 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await interaction.channel.bulkDelete(amount);
    }

    // reply to the interaction
    await interaction.reply(`Sent ${amount} messages!`);
}
