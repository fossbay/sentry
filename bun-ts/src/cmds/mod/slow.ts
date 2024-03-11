import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('slow')
    .setDescription('slow a channel from 0-21600!')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to slow')
            .setRequired(true),
    )
    .addIntegerOption((option?) =>
        option
            .setName('amount')
            .setDescription('How long to slow the channel for')
            .setMinValue(0)
            .setMaxValue(21600),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: ChatInputCommandInteraction) {
    const channel_string = interaction.options.get('channel')?.value as string;
    const amount = interaction.options.getInteger('amount') || 0;

    const channel = interaction.guild?.channels.cache.get(
        channel_string,
    ) as TextChannel;

    if (!channel) {
        await interaction.reply(`Unknown channel ${channel_string}`);
        return;
    }

    await channel.setRateLimitPerUser(amount);

    // Set slow mode to amount for channel (mention the channel)
    await interaction.reply(`Set slow mode to \`${amount}\` for ${channel}`);
}
