import { env } from "@/env.mjs"
import { APIApplication } from "discord-api-types/v10"

export async function GlobalCommands() {
  try {
    const commands = await fetch(`https://discord.com/api/v8/applications/${env.DISCORD_APP_ID}/commands`, {
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 60 * 5 },
    }).then((res) => res.json() as Promise<APIApplication[]>)
    if (commands.length <= 0) {
      return <p className="pt-6">No commands found :(</p>
    }

    return (
      <table>
        <thead className="text-left">
          <tr className="border-b">
            <th className="px-2">ID</th>
            <th className="px-2">Name</th>
            <th className="px-2">Description</th>
            <th className="px-2">Options</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command) => (
            <tr key={command.id}>
              <td className="px-2">{command.id} </td>
              <td className="px-2">{command.name} </td>
              <td className="px-2">{command.description} </td>
              <td className="px-2">
                {/* @ts-ignore */}
                {command.options ? <code>{JSON.stringify(command.options[0])}</code> : "No options"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  } catch (error) {
    return (
      <div>
        <p>Failed to get commands for your Discord app. Make sure your environment variables are set up correctly!</p>
      </div>
    )
  }
}
