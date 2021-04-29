/* 
  A select subset of types pulled directly from the Discord docs
  Types are often incomplete due to laziness, mostly only defined the fields we need
*/

import {
  APIApplicationCommandInteraction,
  APIInteractionResponse,
} from "discord-api-types"
import { NextApiRequest, NextApiResponse } from "next"

export type DiscordInteractionApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<APIInteractionResponse>,
  interaction: APIApplicationCommandInteraction
) => void | Promise<void>
