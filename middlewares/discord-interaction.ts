import { APIApplicationCommandInteraction } from "discord-api-types/v8"
import { DiscordInteractionApiHandler } from "interfaces/discord"
import { NextApiRequest, NextApiResponse } from "next"
import nacl from "tweetnacl"
import { parseRawBodyAsString } from "utils/body-parser"

// Your public key can be found on your application in the Developer Portal
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY

if (!DISCORD_APP_PUBLIC_KEY) {
  throw new Error("Environment variables not configured correctly")
}

export type VerifyHeadersArgs = {
  timestamp: string
  rawBody: string
  signature: string
}

/**
 * Verifies the headers sent from Discord according to
 * https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
 */
export const verifyHeaders = ({ timestamp, rawBody, signature }: VerifyHeadersArgs) => {
  return nacl.sign.detached.verify(
    Buffer.from(timestamp + rawBody),
    Buffer.from(signature, "hex"),
    Buffer.from(DISCORD_APP_PUBLIC_KEY, "hex")
  )
}

/**
 * Middleware to verify the validity of the incoming webhook request according to https://discord.com/developers/docs/interactions/slash-commands#security-and-authorization
 *
 * When using this middleware, your API route handler must disable body parsing
 */
const withDiscordInteraction = (next: DiscordInteractionApiHandler) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const signature = req.headers["x-signature-ed25519"]
  const timestamp = req.headers["x-signature-timestamp"]
  if (typeof signature !== "string" || typeof timestamp !== "string") {
    return res.status(401).end("invalid request signature")
  }

  try {
    const rawBody = await parseRawBodyAsString(req)
    const isVerified = verifyHeaders({ timestamp, rawBody, signature })
    if (!isVerified) {
      return res.status(401).end("invalid request signature")
    }

    // Parse the message as JSON
    const interaction: APIApplicationCommandInteraction = JSON.parse(rawBody)
    const { type } = interaction

    if (type === 1) {
      // PING message, respond with ACK (part of Discord's security and authorization protocol)
      return res.status(200).json({ type: 1 })
    } else {
      return await next(req, res, interaction)
    }
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Oops, something went wrong parsing the request!",
    })
  }
}

export default withDiscordInteraction
