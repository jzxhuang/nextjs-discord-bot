import { NextApiRequest, NextApiResponse } from "next"
import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
} from "discord-api-types/payloads/v8"
import discordInteraction from "middlewares/discord"

// disable body parsing, need the raw body as per https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (
  _: NextApiRequest,
  res: NextApiResponse<APIInteractionResponse>,
  interaction: APIApplicationCommandInteraction
) => {
  const {
    data: { name },
  } = interaction

  switch (name) {
    default:
      return res.status(200).json({
        type: 4,
        data: {
          content: "Oops! I don't recognize this command.",
        },
      })
  }
}

export default discordInteraction(handler)
