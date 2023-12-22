import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DISCORD_APP_ID: z
      .string({
        required_error:
          "DISCORD_APP_ID is required. Visit https://discord.com/developers/applications -> Your bot -> General information -> Application ID",
      })
      .min(
        1,
        "DISCORD_APP_ID is required. Visit https://discord.com/developers/applications -> Your bot -> General information -> Application ID"
      ),
    DISCORD_APP_PUBLIC_KEY: z
      .string({
        required_error:
          "DISCORD_APP_PUBLIC_KEY is required. Visit https://discord.com/developers/applications -> General information -> PUBLIC KEY",
      })
      .min(
        1,
        "DISCORD_APP_PUBLIC_KEY is required. Visit https://discord.com/developers/applications -> General information -> PUBLIC KEY"
      ),
    DISCORD_BOT_TOKEN: z
      .string({
        required_error:
          "DISCORD_BOT_TOKEN is required. Visit https://discord.com/developers/applications -> Bot -> Token. This variable used only for register commands",
      })
      .min(
        1,
        "DISCORD_BOT_TOKEN is required. Visit https://discord.com/developers/applications -> Bot -> Token. This variable used only for register commands"
      ),
    ROOT_URL: z.string().url("ROOT_URL must be a valid URL").optional().default("http://localhost:3000"),
  },
  onInvalidAccess: (error) => {
    throw new Error(`❌ Attempted to access a server-side environment variable on the client: ${error}`)
  },
  onValidationError: (error) => {
    throw new Error(
      `❌ Invalid environment variables:\n\n${error.errors.map((e, i) => `❌[${i}]: ${e.message}`).join("\n")}\n`
    )
  },
})
