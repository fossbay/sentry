from discord.ext import commands


async def setup(sentry):
    await sentry.add_cog(owner(sentry))


async def teardown(sentry):
    await sentry.remove_cog("owner")


class owner(commands.Cog):
    def __init__(self, sentry: commands.Bot):
        self.sentry = sentry

    @commands.command()
    @commands.is_owner()
    async def load(self, ctx, *, extension: str):
        try:
            try:
                await self.sentry.load_extension(f"cmds.{extension}")
            except commands.ExtensionAlreadyLoaded:
                await self.sentry.reload_extension(f"cmds.{extension}")
            await ctx.reply(f"Loaded {extension}", mention_author=False)
        except Exception as e:
            await ctx.reply(f"Error loading {extension}: {e}", mention_author=False)

    @commands.command()
    @commands.is_owner()
    async def unload(self, ctx, *, extension: str):
        try:
            await self.sentry.unload_extension(f"cmds.{extension}")
            await ctx.reply(f"Unloaded {extension}", mention_author=False)
        except Exception as e:
            await ctx.reply(f"Error unloading {extension}: {e}", mention_author=False)

    @commands.command()
    @commands.is_owner()
    async def dm(self, ctx, user: commands.UserConverter, *, message: str):
        try:
            await user.send(message)
            await ctx.reply("Sent message", mention_author=False)
        except Exception as e:
            await ctx.reply(f"Error sending message: {e}", mention_author=False)

    @commands.command()
    @commands.is_owner()
    async def log(self, ctx, *, message: str):
        print(message)
        await ctx.reply("Logged message", mention_author=False)

    @commands.command()
    @commands.is_owner()
    async def say(self, ctx, *, message: str):
        await ctx.message.delete()
        await ctx.send(message)

    @commands.command()
    @commands.is_owner()
    async def sync(self, ctx: commands.Context, guild: commands.GuildConverter = None):
        try:
            await self.sentry.tree.sync(guild=guild)
            await ctx.reply("Synced", mention_author=False)
        except Exception as e:
            await ctx.reply(f"Error syncing: {e}", mention_author=False)