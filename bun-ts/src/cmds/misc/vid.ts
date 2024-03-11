import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('vid')
    .setDescription('Embed a video')
    .addStringOption((option) =>
        option
            .setName('vid_url')
            .setDescription('The url of the tiktok or instagram video')
            .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const vid_url = interaction.options.getString('vid_url', true);

    // get the video
    const data = await fetch('https://api.quickvids.win/v1/shorturl/create', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input_text: vid_url,
        }),
    }).then((res) => res.json());

    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const video_url = data['quickvids_url'] || 'Unable to get video';

    await interaction.reply({
        content: video_url,
        ephemeral: false,
    });
}
