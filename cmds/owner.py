from discord.ext import commands 

async def setup(sentry):
    await sentry.add_cog(owner(sentry))

async def teardown(sentry):
    await sentry.remove_cog('owner')

class owner(commands.Cog):
    def __init__(self, sentry: commands.Bot):
        self.sentry = sentry

    @commands.command()
    @commands.is_owner()
    async def load(self, ctx, *, extension: str):
        try:
            try:
                await self.sentry.load_extension(f'cmds.{extension}')
            except commands.ExtensionAlreadyLoaded:
                await self.sentry.reload_extension(f'cmds.{extension}')
            await ctx.reply(f'Loaded {extension}', mention_author=False)
        except Exception as e:
            await ctx.reply(f'Error loading {extension}: {e}', mention_author=False)

    @commands.command()
    @commands.is_owner()
    async def unload(self, ctx, *, extension: str):
        try:
            await self.sentry.unload_extension(f'cmds.{extension}')
            await ctx.reply(f'Unloaded {extension}', mention_author=False)
        except Exception as e:
            await ctx.reply(f'Error unloading {extension}: {e}', mention_author=False)
        