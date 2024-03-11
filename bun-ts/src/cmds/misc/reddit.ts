// Will be updated to use the reddit api instead of the random post api
// Also support custom subreddits

import {ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder,} from 'discord.js';

import {colors} from '../../util';

export const data = new SlashCommandBuilder()
    .setName('reddit')
    .setDescription('Replies with random images!')
    .addStringOption((option) =>
        option
            .setName('subreddit')
            .setDescription('subreddit to get post from')
            .setRequired(true)
            .addChoices(
                {
                    name: 'meme',
                    value: 'meme',
                },
                {
                    name: 'animal',
                    value: 'animal',
                },
                {
                    name: 'food',
                    value: 'food',
                },
                {
                    name: 'car',
                    value: 'car',
                },
            ),
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const inputSubreddit = interaction.options
        .getString('subreddit', true)
        .toLowerCase();

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let post: any;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let data: any;
    while (true) {
        post = await getPost(interaction, inputSubreddit);
        data = post[0].data.children[0].data;

        if (!data.over_18) {
            break;
        }
    }
    const title = data.title;
    const url = data.url;
    const subreddit = data.subreddit_name_prefixed;
    const img = data.url_overridden_by_dest;
    const author = data.author;
    const description = `**[${title}](${url})**\n\nPosted in **${subreddit}** by **u/${author}**`;

    const embed = new EmbedBuilder()
        .setColor(colors.reddit as ColorResolvable)
        .setDescription(description)
        .setImage(img)
        .setTimestamp(new Date())
        .setFooter({
            text: `requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL() as string,
        });

    await interaction.reply({
        embeds: [embed],
    });
}

async function getPost(
    interaction: ChatInputCommandInteraction,
    inputSubreddit: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> {
    // fetch a random meme from reddit
    let subreddits: string[];
    switch (inputSubreddit) {
        case 'meme':
            subreddits = ['memes', 'dankmemes', 'me_irl', 'comedyheaven'];
            break;
        case 'animal':
            subreddits = [
                'animal',
                'aww',
                'eyebleach',
                'cats',
                'dogpictures',
                'foxes',
            ];
            break;
        case 'food':
            subreddits = ['food', 'foodporn'];
            break;
        case 'car':
            subreddits = ['cars', 'carporn'];
            break;
        default:
            // should never happen but easter egg
            subreddits = ['404'];
    }

    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

    try {
        const response = await fetch(
            `https://www.reddit.com/r/${subreddit}/random/.json`,
        );
        return await response.json();
    } catch (error) {
        console.log(error);
        return '';
    }
}
