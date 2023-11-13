/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#registering-a-command
 */

import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10"

const PING_COMMAND = {
  name: "ping",
  description: "Ping pong! I'll respond with pong.",
} as const

const INVITE_COMMAND = {
  name: "invite",
  description: "Get an invite link to add this bot to your server",
} as const

const POKEMON_COMMAND = {
  name: "pokemon",
  description: "Get a preview of a Pokemon by name or Pokedex number",
  options: [
    {
      name: "number",
      description: "Enter Pokedex number",
      min_value: 1,
      type: ApplicationCommandOptionType.Integer,
    },
    {
      name: "name",
      description: "Enter Pokemon name",
      type: ApplicationCommandOptionType.String,
    },
  ],
}

export type RandomPicType = "cat" | "dog" | "picsum"
export const RANDOM_PIC_COMMAND = {
  name: "randompic",
  description: "Get a random picture",
  options: [
    {
      name: "type",
      description: "What type of picture would you like?",
      type: ApplicationCommandType.Message,
      required: true,
      choices: [
        { name: "cat", value: "cat" },
        { name: "dog", value: "dog" },
        { name: "generic", value: "picsum" },
      ],
    },
  ],
} as const

export const commands = {
  ping: PING_COMMAND,
  invite: INVITE_COMMAND,
  pokemon: POKEMON_COMMAND,
  randompic: RANDOM_PIC_COMMAND,
} as const
