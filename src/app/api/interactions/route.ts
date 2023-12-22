import { commands, RandomPicType } from "@/commands"
import { verifyInteractionRequest } from "@/discord/verify-incoming-request"
import { env } from "@/env.mjs"
import {
  APIInteractionDataOptionBase,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10"
import { NextResponse } from "next/server"
import { getRandomPic } from "./random-pic"

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge"

const ROOT_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.ROOT_URL

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(request, env.DISCORD_APP_PUBLIC_KEY)
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 })
  }
  const { interaction } = verifyResult

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong })
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const { name } = interaction.data

    switch (name) {
      case commands.ping.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Pong` },
        })

      case commands.invite.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Click this link to add NextBot to your server: https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_APP_ID}&permissions=2147485696&scope=bot%20applications.commands`,
            flags: MessageFlags.Ephemeral,
          },
        })

      case commands.pokemon.name:
        if (!interaction.data.options || interaction.data.options?.length < 1) {
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              content: "Oops! Please enter a Pokemon name or Pokedex number.",
              flags: MessageFlags.Ephemeral,
            },
          })
        }

        const option = interaction.data.options[0]
        // @ts-ignore
        const idOrName = String(option.value).toLowerCase()

        try {
          const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`).then((res) => {
            return res.json()
          })
          const types = pokemon.types.reduce(
            (prev: string[], curr: { type: { name: string } }) => [...prev, capitalizeFirstLetter(curr.type.name)],
            []
          )

          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
              embeds: [
                {
                  title: capitalizeFirstLetter(pokemon.name),
                  image: {
                    url: `${ROOT_URL}/api/pokemon/${idOrName}`,
                  },
                  fields: [
                    {
                      name: "Pokedex",
                      value: `#${String(pokemon.id).padStart(3, "0")}`,
                    },
                    {
                      name: "Type",
                      value: types.join("/"),
                    },
                  ],
                },
              ],
            },
          })
        } catch (error) {
          throw new Error("Something went wrong :(")
        }

      case commands.randompic.name:
        const { options } = interaction.data
        if (!options) {
          return new NextResponse("Invalid request", { status: 400 })
        }

        const { value } = options[0] as APIInteractionDataOptionBase<ApplicationCommandOptionType.String, RandomPicType>
        const embed = await getRandomPic(value)
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { embeds: [embed] },
        })

      default:
      // Pass through, return error at end of function
    }
  }

  return new NextResponse("Unknown command", { status: 400 })
}
