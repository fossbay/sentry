import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('sentry')
    .setDescription('Information about Sentry');

export async function execute(interaction: ChatInputCommandInteraction) {
    // microseconds to milliseconds
    // microseconds to milliseconds
    // e.g. 1d 2h 3m 4s = 93784 seconds
    // Embedded message with information about Sentry
    const trueLatency = Math.floor(interaction.client.ws.ping);
    const userCpuUsage = Math.floor(process.cpuUsage().user / 1000);
    const systemCpuUsage = Math.floor(process.cpuUsage().system / 1000);
    const memoryUsage = Math.floor(process.memoryUsage().rss / 1024 / 1024);
    const uptime = Math.floor(process.uptime());
    const fmtUptime = {
            days: Math.floor(uptime / 86400),
            hours: Math.floor((uptime % 86400) / 3600),
            minutes: Math.floor((uptime % 3600) / 60),
            seconds: Math.floor(uptime % 60),
        };
    const uptimeString = `${fmtUptime.days}d ${fmtUptime.hours}h ${fmtUptime.minutes}m ${fmtUptime.seconds}s`;
    const owner = interaction.client.users.cache.get(process.env.OWNER_ID)?.tag;
    const githubLink = 'https://github.com/m1ten/sentry';
    const embed = new EmbedBuilder()
            .setColor('#32CD32')
            .setTitle('sentry')
            .setDescription('Information about sentry')
            // .setThumbnail(interaction.client.user?.displayAvatarURL() as string)
            .addFields(
                {
                    name: 'Latency',
                    value: `${trueLatency} ms`,
                    inline: true,
                },
                {
                    name: 'CPU Usage',
                    value: `user: ${userCpuUsage} ms\nsystem: ${systemCpuUsage} ms`,
                    inline: true,
                },
                {
                    name: 'Memory Usage',
                    value: `${memoryUsage} MB`,
                    inline: true,
                },
                {
                    name: 'Uptime',
                    value: uptimeString,
                    inline: true,
                },
                // Embed links to the github repo and the owner's github
                {
                    name: 'Links',
                    value: `[GitHub](${githubLink})`,
                    inline: true,
                },
            )
            .setFooter({
                text: `Written in TS using discord.js and bun.sh\nMade by @${owner}`,
                iconURL: interaction.client.users.cache
                    .get(process.env.OWNER_ID)
                    ?.displayAvatarURL() as string,
            })
            .setURL(githubLink);

    await interaction.reply({
        embeds: [embed],
    });
}
