import { RandomPicType } from "@/commands"
import { APIEmbed } from "discord-api-types/v10"
import ky from "ky"
import { nanoid } from "nanoid"

const baseRandomPicEmbed = {
  title: "Random Pic",
  description: "Here's your random pic!",
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object
 */
const createEmbedObject = (source: string, path: string): APIEmbed => {
  return {
    ...baseRandomPicEmbed,
    fields: [{ name: "source", value: source }],
    image: {
      url: `${source}${path}`,
    },
  }
}

/**
 * Fetches a random picture and returns it as a Discord image embed.
 */
export const getRandomPic = async (value: RandomPicType) => {
  switch (value) {
    case "cat":
      const { url } = await ky.get("https://cataas.com/cat?json=true").json<{ url: string }>()
      return { ...createEmbedObject("https://cataas.com", url), description: "Here's a random cat picture!" }

    case "dog":
      const { message } = await ky.get("https://dog.ceo/api/breeds/image/random").json<{ message: string }>()
      return {
        ...baseRandomPicEmbed,
        description: "Here's a random dog picture!",
        fields: [{ name: "source", value: "https://dog.ceo/api" }],
        image: { url: message },
      }

    default:
      return createEmbedObject("https://picsum.photos", `/seed/${nanoid()}/500`)
  }
}
