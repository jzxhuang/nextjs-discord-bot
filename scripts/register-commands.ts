/**
 * Registers commands for your Discord bot.
 *
 * This file is meant to be run from the command line, and is not used by the
 * application server. It only needs to be run once.
 * Requires Node 18+ for built-in fetch, otherwise you need to polyfill fetch.
 *
 * ===== Usage =====
 * Run `yarn register-commands` from the root of the repository.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
 */

import { commands } from "@/commands"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_APP_ID = process.env.DISCORD_APP_ID
if (!DISCORD_BOT_TOKEN) {
  throw new Error("The DISCORD_BOT_TOKEN environment variable is required.")
}
if (!DISCORD_APP_ID) {
  throw new Error("The DISCORD_APP_ID environment variable is required.")
}

const URL = `https://discord.com/api/v10/applications/${DISCORD_APP_ID}/commands`

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
 */
async function main() {
  const response = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
    method: "PUT",
    body: JSON.stringify(Object.values(commands)),
  })

  if (response.ok) {
    console.log("Registered all commands")
    const data = await response.json()
    console.log(JSON.stringify(data, null, 2))
  } else {
    console.error("Error registering commands")
    let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`
    try {
      const error = await response.text()
      if (error) {
        errorText = `${errorText} \n\n ${error}`
      }
    } catch (err) {
      console.error("Error reading body from request:", err)
    }
    console.error(errorText)
  }
}

main()
