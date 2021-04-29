import axios from "axios"
import { GuildMember, Role } from "interfaces/discord"

export const discordClient = axios.create({
  baseURL: "https://discord.com/api/v8/",
  headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
})

export const getRolesForGuild = (guildId: string) =>
  discordClient.get<Role[]>(`guilds/${guildId}/roles`)

export const getGuildMember = (guildId: string, userId: string) =>
  discordClient.get<GuildMember>(`guilds/${guildId}/members/${userId}`)

/**
 * Note that this does NOT preserve the user's previous roles!
 */
export const updateRolesForMember = (
  guildId: string,
  userId: string,
  roles: string[]
) => {
  discordClient.patch<GuildMember>(`guilds/${guildId}/members/${userId}`, {
    roles,
  })
}
