export const colors = {
    primary: '#00b0f4',
    success: '#00f49c',
    nonErrRed: '#f45',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    reddit: '#ff4500',
} as const;

export const emojis = {
    loading:
        'https://cdn.discordapp.com/emojis/451435482073792513.gif?size=240&quality=lossless',
} as const;

export function isOwner(id: string): boolean {
    return id === process.env.OWNER_ID;
}

export default {
    colors,
    emojis,
    isOwner,
};
