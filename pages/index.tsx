import React from "react"
import { InferGetServerSidePropsType } from "next"
import { getGlobalCommands } from "services/discord"

export const getServerSideProps = async () => {
  try {
    const { data } = await getGlobalCommands()
    return { props: { data } }
  } catch (err) {
    console.error(err)
    return { props: { data: null } }
  }
}

const IndexPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>i.e. you could build a dashboard here... we'll just fetch all the slash commands the bot has registered</h2>
      {data && data.length > 0 ? (
        <div>
          <h3>All commands</h3>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>description</th>
                <th>default permission</th>
                <th>options</th>
              </tr>
            </thead>
            <tbody>
              {data.map((command) => (
                <tr key={command.id}>
                  <td>{command.id} </td>
                  <td>{command.name} </td>
                  <td>{command.description} </td>
                  <td>{String(command.default_permission)}</td>
                  <td>{command.options ? <div>{JSON.stringify(command.options[0])}</div> : "No options"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        "No commands found"
      )}
    </div>
  )
}

export default IndexPage
