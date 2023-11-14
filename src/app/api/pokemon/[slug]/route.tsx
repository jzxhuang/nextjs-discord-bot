import { ImageResponse } from "next/og"

export const runtime = "edge"

/**
 * Generates an image containing a
 * Pokemon' name, Pokedex number, and image.
 *
 * Accepts either a Pokemon's name or Pokedex number as the slug.
 * If the pokemon cannot be found, returns Unown.
 *
 * @see https://vercel.com/docs/functions/edge-functions/og-image-generation
 *
 * Responses are automatically cached in production.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  // From https://www.dafont.com/pokemon.font
  const fontData = await fetch(new URL("../../../../../assets/pokemon/Pokemon-Solid.ttf", import.meta.url)).then(
    (res) => res.arrayBuffer()
  )

  let name = "Unown"
  let number = "???"
  let exists = false

  const { slug } = params

  /** @see https://pokeapi.co/docs/v2#pokemon-section */
  try {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`).then((res) => res.json())
    name = pokemon.name
    number = String(pokemon.id)
    exists = true
  } catch (_) {
    // Pokemon doesn't exist, or some other error.
    // We'll return Unown :)
  }

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full items-center justify-center bg-white text-center text-4xl text-black"
        style={{ fontFamily: "Pokemon" }}
      >
        <div tw="flex flex-col items-center text-center py-8 px-8">
          <p tw="m-0 font-bold text-7xl tracking-wide capitalize">{name}</p>
          <p tw="m-0 text-5xl pt-6 tracking-wider">#{number.padStart(3, "0")}</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={name}
          tw="ml-5"
          width="360"
          height="360"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
            exists ? number : 201
          }.png`}
        />
      </div>
    ),
    {
      width: 960,
      height: 540,
      fonts: [{ name: "Pokemon", data: fontData, style: "normal" }],
    }
  )
}
