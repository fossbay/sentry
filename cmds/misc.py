import discord
from discord.ext import commands

SENTRY_COLOR = 0x89B4F9

async def setup(sentry):
    await sentry.add_cog(misc(sentry))


async def teardown(sentry):
    await sentry.remove_cog("misc")


class misc(commands.Cog):
    def __init__(self, sentry: commands.Bot):
        self.sentry = sentry

    @commands.hybrid_command()
    async def echo(self, ctx, *, message: str):
        embed = discord.Embed(
            title="echo",
            description=message,
            color=SENTRY_COLOR,
            timestamp=ctx.message.created_at,
        )
        embed.set_footer(text="requested by " + str(ctx.author))
        await ctx.send(embed=embed)

    @commands.hybrid_command()
    async def sentry(self, ctx):
        embed = discord.Embed(
            title="about me",
            color=SENTRY_COLOR,
            timestamp=ctx.message.created_at,
            description="made by <@648929307741257729>",
        )
        embed.add_field(name="name", value=self.sentry.user.name, inline=True)
        embed.add_field(name="id", value=self.sentry.user.id, inline=True)
        embed.add_field(
            name="latency", value=f"{round(self.sentry.latency * 1000)}ms", inline=False
        )
        embed.set_footer(text=f"requested by {ctx.author}", icon_url=ctx.author.display_avatar)
        embed.set_image(url=self.sentry.user.display_avatar)
        await ctx.send(embed=embed)
