import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import util from '../../util';

export const data = new SlashCommandBuilder()
    .setName('role')
    .setDescription('Replies with Hello!')
    // action (Add or Remove)
    // which role
    // which user
    .addStringOption((option) =>
        option
            .setName('action')
            .setDescription('add or remove')
            .setRequired(true)
            .addChoices(
                { name: 'add', value: 'add' },
                { name: 'remove', value: 'remove' },
            ),
    )
    .addRoleOption((option) =>
        option.setName('role').setDescription('Which role?').setRequired(true),
    )
    .addUserOption((option) =>
        option
            .setName('member')
            .setDescription('Which user?')
            .setRequired(true),
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
    const action = interaction.options.get('action')?.value as string;
    const role = interaction.options.get('role')?.value as string;
    const user = interaction.options.get('member')?.value as string;
    if (action === 'add') {
        await interaction.guild?.members.cache.get(user)?.roles.add(role);
        await interaction.reply(`Added ${role} to ${user}`);
    } else if (action === 'remove') {
        await interaction.guild?.members.cache.get(user)?.roles.remove(role);
        await interaction.reply(`Removed ${role} from ${user}`);
    } else {
        await interaction.reply(`Unknown action ${action}`);
    }
}
