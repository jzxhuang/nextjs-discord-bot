import { createEnv } from "@t3-oss/env-nextjs"
import dotenv from "dotenv"
import { z } from "zod"

dotenv.config({ path: ".env.local" })

export const env = createEnv({
  server: {
    DISCORD_APP_ID: z
      .string({
        required_error:
          "DISCORD_APP_ID is required. Visit https://discord.com/developers/applications -> Your bot -> General information -> Application ID. Required in .env.local",
      })
      .min(
        1,
        "DISCORD_APP_ID is required. Visit https://discord.com/developers/applications -> Your bot -> General information -> Application ID. Required in .env.local"
      ),
    DISCORD_BOT_TOKEN: z
      .string({
        required_error:
          "DISCORD_BOT_TOKEN is required. Visit https://discord.com/developers/applications -> Bot -> Token. This variable used only for register commands. Required in .env.local",
      })
      .min(
        1,
        "DISCORD_BOT_TOKEN is required. Visit https://discord.com/developers/applications -> Bot -> Token. This variable used only for register commands. Required in .env.local"
      ),
  },
  onValidationError: (error) => {
    throw new Error(
      `❌ Invalid environment variables:\n\n${error.errors.map((e, i) => `❌[${i}]: ${e.message}`).join("\n")}\n`
    )
  },
})
