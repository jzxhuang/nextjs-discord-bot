import { APIApplication } from "discord-api-types/v9"
import ky from "ky"

export const discordApiClient = ky.create({
  prefixUrl: "https://discord.com/api/v10",
  headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
})

/**
 * @see https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands
 */
export const getGlobalCommands = ({ appId }: { appId: string }) =>
  discordApiClient.get(`applications/${appId}/commands`).json<APIApplication[]>()
