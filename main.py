import discord
from discord.ext import commands
import os

from dotenv import dotenv_values

env = dotenv_values(".env")

intents = discord.Intents.default().all()
sentry = commands.Bot(command_prefix=".", intents=intents)


@sentry.event
async def on_ready():
    name = sentry.user.name
    id = sentry.user.id

    for filename in os.listdir("./cmds"):
        if not filename.startswith(".") and filename.endswith(".py"):
            await sentry.load_extension(f"cmds.{filename[:-3]}")

    print(f"{name} is ready" + " with id: " + str(id))


@sentry.event
async def on_message(message):
    if message.author == sentry.user:
        return

    await sentry.process_commands(message)


sentry.run(env["TOKEN"])
