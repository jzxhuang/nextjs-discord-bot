import axios from "axios"
import { APIApplicationCommand } from "discord-api-types/v8"

const DISCORD_APP_ID = process.env.DISCORD_APP_ID
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

if (!DISCORD_APP_ID || !DISCORD_BOT_TOKEN) {
  throw new Error("Environment variables not configured correctly")
}

export const discordClient = axios.create({
  baseURL: "https://discord.com/api/v8",
  headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
})

export const getGlobalCommands = () =>
  discordClient.get<APIApplicationCommand[]>(`/applications/${DISCORD_APP_ID}/commands`)

export type CreateGlobalCommand = Omit<APIApplicationCommand, "id" | "application_id">
export const createGlobalCommand = (command: CreateGlobalCommand) =>
  discordClient.post<APIApplicationCommand>(`/applications/${DISCORD_APP_ID}/commands`, command)
