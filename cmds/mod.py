from discord.ext import commands


async def setup(sentry):
    await sentry.add_cog(mod(sentry))


async def teardown(sentry):
    await sentry.remove_cog("mod")


class mod(commands.Cog):
    def __init__(self, sentry: commands.Bot):
        self.sentry = sentry

    @commands.hybrid_command(aliases=["clear"])
    async def purge(self, ctx: commands.Context, amount: int = 3):
        amount = min(amount, 100)
        await ctx.channel.purge(limit=amount)
        await ctx.send(f"Purged {amount} messages", delete_after=3)
