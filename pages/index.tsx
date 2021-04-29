import React from "react"
import { InferGetServerSidePropsType } from "next"
import { createGlobalCommand, getGlobalCommands } from "services/discord"

export const getServerSideProps = async () => {
  try {
    const { data } = await getGlobalCommands()
    // await createGlobalCommand({
    //   name: "randompic",
    //   description: "Get a random picture",
    //   options: [
    //     {
    //       name: "type",
    //       description: "What type of picture would you like?",
    //       type: 3,
    //       required: true,
    //       choices: [
    //         { name: "cat", value: "cat" },
    //         { name: "dog", value: "dog" },
    //         { name: "generic", value: "picsum" },
    //       ],
    //     },
    //   ],
    // })
    return { props: { data } }
  } catch (err) {
    console.error(err)
    return { props: { data: null } }
  }
}

const IndexPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log("data:", data)

  return <div>Hello World</div>
}

export default IndexPage
