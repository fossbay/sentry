import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('clear the chat!')
    .addIntegerOption((option) =>
        option
            .setName('amount')
            .setDescription('How many messages to delete')
            .setRequired(true),
    )
    .addUserOption((option) =>
        option
            .setName('user')
            .setDescription("The user's messages to purge")
            .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
    let amount = interaction.options.getInteger('amount') as number;
    const user = interaction.options.getUser('user') || null;

    if (amount <= 0) {
        await interaction.reply('Amount must be greater than 0!');
        return;
    } else if (amount > 99) {
        amount = 99;
    }

    const messages = await interaction.channel?.messages.fetch({
        limit: amount,
    });
    // filter out messages that are older than 14 days
    let filtered = messages?.filter(
        (m) => Date.now() - m.createdTimestamp < 1209600000,
    );

    // filter out messages that are not from the user
    if (user !== null) {
        filtered = filtered?.filter((m) => m.author.id === user.id);
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    await (interaction.channel as TextChannel).bulkDelete(filtered as any);
    // save the filtered messages to a json file
    fs.writeFileSync('purged-messages.json', JSON.stringify(filtered, null, 2));
    await interaction.reply(`Deleted ${messages?.size} messages!`);
}
