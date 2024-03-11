// import discord.js
import {
    ApplicationCommand,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
} from 'discord.js';
import fs from 'fs';
import path from 'path';

// create a new Client instance
const client = Object.assign(
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel],
    }),
    {
        commands: new Collection<string, ApplicationCommand>(),
    },
);

client.commands = new Collection();

const dirname = import.meta.dirname;

const foldersPath = path.join(dirname, 'cmds');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(
            (file) =>
                (file.endsWith('.js') || file.endsWith('.ts')) &&
                !file.startsWith('.'),
        );
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        const missing = [];
        if (!('data' in command)) missing.push('data');
        if (!('execute' in command)) missing.push('execute');
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if (missing.length === 0) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing the following properties: ${missing.join(
                    ', ',
                )}`,
            );
        }
    }
}

const eventsPath = path.join(dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(
        (file) =>
            (file.endsWith('.js') || file.endsWith('.ts')) &&
            !file.startsWith('.'),
    );

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// login with the token from .env.local
client.login(process.env.BOT_TOKEN);
