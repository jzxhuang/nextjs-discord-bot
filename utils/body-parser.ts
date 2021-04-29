import { NextApiRequest } from "next"

/**
 * Parse body from payload as raw string: https://github.com/vercel/next.js/blob/86160a5190c50ea315c7ba91d77dfb51c42bc65f/test/integration/api-support/pages/api/no-parsing.js
 */
export const parseRawBodyAsString = (req: NextApiRequest) =>
  new Promise<string>((resolve) => {
    let data = ""
    req.on("data", (chunk) => {
      data += chunk
    })
    req.on("end", () => {
      resolve(Buffer.from(data).toString())
    })
  })
