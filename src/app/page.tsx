import { Suspense } from "react"
import { GlobalCommands } from "./global-commands"

export default async function Page() {
  return (
    <main className="container mx-auto px-3 py-6">
      <section className="grid grid-cols-1 gap-2">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">NextBot</h1>
        <h2 className="text-xl tracking-tight text-slate-500">
          A Discord bot template built with Next.js that runs in the edge runtime.
        </h2>
        <div className="flex gap-2">
          <a
            className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-fit items-center justify-center rounded-md bg-[#7289DA] px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            href="https://discord.gg/NmXuqGgkb3"
            target="_blank"
            rel="noreferrer"
          >
            Try it out
          </a>
          <a
            className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-fit items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            href="https://github.com/jzxhuang/nextjs-discord-bot"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-2 pt-12">
        <p className="font-semibold">
          This is an example of an admin portal might look like. It leverages RSCs to fetch the Slash commands
          associated with the Discord bot!
        </p>
        <Suspense fallback={null}>
          <GlobalCommands />
        </Suspense>
      </section>
    </main>
  )
}
