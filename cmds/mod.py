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

    @commands.command()
    async def tag(self, ctx: commands.Context, name: str, *, content: str):
        import json

        with open("tags.json", "r") as f:
            tags = json.load(f)
        tags[name] = content
        with open("tags.json", "w") as f:
            json.dump(tags, f, indent=4)
        await ctx.send(f"Created tag {name}")

    @commands.command()
    async def tags(self, ctx: commands.Context):
        import json

        with open("tags.json", "r") as f:
            tags = json.load(f)
        await ctx.send("\n".join(tags.keys()))

    @commands.command()
    async def untag(self, ctx: commands.Context, name: str):
        import json

        with open("tags.json", "r") as f:
            tags = json.load(f)
        tags.pop(name)
        with open("tags.json", "w") as f:
            json.dump(tags, f, indent=4)
        await ctx.send(f"Deleted tag {name}")
