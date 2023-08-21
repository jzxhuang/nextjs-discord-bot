# NextBot: Next.js Discord Bot Template that runs in the Edge Runtime

NextBot is a template for building and deploying a Discord bot with Next.js. It runs 100% in the edge runtime so you get
lightning-fast responses and zero cold starts. It uses Discord interactions webhooks to receive and reply to commands.

![Demo GIF](docs/demo.gif)

- Runs at the edge: Lightning-fast responses, no cold start.
- Free & easy to deploy: Deploy to Vercel in seconds at no cost. No need to host a server or VM to run your bot! Don't
  bother with Heroku, EC2, etc.
- Easy to extend: Since the bot is built on Next.js, you can easily build an accompanying webapp in the same repo.

## Try it out

Join https://discord.gg/NmXuqGgkb3 to try out a demo of NextBot. Type one of these slash commands into the general
channel:

- `/ping`
- `/invite`
- `/randompic`

Or add NextBot to your own server with this link:
https://discord.com/api/oauth2/authorize?client_id=837427503059435530&permissions=2147485696&scope=bot%20applications.commands

You can also send slash commands through DM to the bot as long as you're in a mutual server with the it!

## Development

Node.js 18+ is required.

### Setup

- Clone the repo. This is a
  [template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
  so you can click the green "Use this template" button on GitHub to create your own repo!
  - Run `yarn` to install dependencies.
- [Create a new Discord application](https://discord.com/developers/applications).
  - In the `Bot` settings of your Discord application, enable the `Message Content` intent.
- Fill out environment variables:
  - In the root of the repository, copy `.env.local.example` into a new file `.env.local`. Fill out the values using the
    real values from your Discord app.
- Register some slash commands for your bot. I've included a script to register the commands included in the demo bot.
  - Run `yarn register-commands` to execute the script! You only need to run this once, unless you add new commands.
  - You can learn more about registering commands in the
    [Discord API docs](https://discord.com/developers/docs/interactions/application-commands#create-global-application-command)

### Local Development

Once you've completed the setup steps above, you're ready to run the bot locally!

Discord can only send events to a public `https` address. You'll need an HTTP tunneling service like
[ngrok](https://ngrok.com/) or [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) when developing locally.
For this guide, I'll be using ngrok.

- Run `yarn dev` to start the Next.js application.
- Assuming you're using ngrok, run `ngrok http 3000` to start your HTTP tunnel.
- In the Discord app settings, set `Interactions Endpoint URL` to `<YOUR_PUBLIC_TUNNELED_NGROK_URL>/api/interactions`.
  Make sure to use the `https` URL!
- Save changes in the Discord app settings.

In order to verify your interactions endpoint URL, Discord will send a `PING` message to your bot, and the bot should
reply with a PONG (see `src/pages/api/interactions.ts`). If this is successful, your bot is ready to go!

You can now add your bot to your Discord server and try it out! Use Discord's URL generator in `OAuth2 -> URL Generator`
of your Discord app's settings to generate an invite link. Make sure to select:

- `bot` + `applications.commands` for scopes
- `Send Messages` + `Use Slash Commands` for bot permissions

After adding the bot to a server, try out one of the slash commands like `/ping` or `randompic`!

- You can try modifying the response of the `/ping` command and the changes should be reflected immediately.
- You're ready to add your own commands!

Note: whenever you terminate/restart your ngrok tunnel, you'll need to update the `Interactions Endpoint URL` in the
Discord app settings accordingly.

## Deploy to Production

This project is designed to be deployed on Vercel. I recommend that you create a new Discord Application for production!
Here are some things you should remember to do when deploying:

- Set the environment variables in Vercel accordingly.
- You can still use `yarn register-commands` to register commands for your production bot, as long as you update your
  `.env.local` file with the correct values.
- You should set `<YOUR_VERCEL_URL>/api/interactions` as the `Interactions Endpoint URL` in your prod Discord app.

## How It Works

Unlike traditional Discord bots which maintain a persistent connection with Discord (and thus require managing your own
servers), NextBot uses Discord's
[Interactions Endpoint](https://discord.com/developers/docs/interactions/slash-commands#receiving-an-interaction) to
respond to interactions (such as slash commands).

The Interactions Endpoint is now Discord's recommended approach to building bots. If you haven't already, I recommend
you read the [Getting Started](https://discord.com/developers/docs/getting-started) and
[Receiving and Responding](https://discord.com/developers/docs/interactions/receiving-and-responding) pages of Discord's
documentation to learn more about Interactions, Slash Commands, and Discord bots!

And be sure to check out the rest of the Discord docs to see all the awesome stuff you can do aside from basic Slash
commands!

### File Structure

- `src/app/api/interactions/route.ts`: This is the main route handler for the Interactions Endpoint. It receives
  interactions from Discord and handles them accordingly.
- `src/discord/verify-incoming-request.ts`: Helper functions to verify incoming requests from Discord, as outlined in https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization.
- `src/app/page.tsx`: A basic web page. This could be your admin portal or whatever you'd like!

## Why Next.js (instead of Express, serverless, or Cloudflare Workers)?

NextBot leverages Next.js 13
[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) to receive and respond to
interactions. But why Next.js instead of something like Express or serverless (AWS Lambda)?

- Next.js is free and effortless to deploy on Vercel. Don't bother with trying to host your Express server
- Compared to serverless, edge is faster (no cold start) and cheaper (Edge Runtimes have more generous free tiers and
  are cheaper per request)

A better comparison would be hosting a Discord bot on Cloudflare Workers, as shown in this
[official Discord tutorial](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers). The Next.js
edge runtime is built on Cloudflare Workers! Still, I think Next.js has some notable benefits:

- Next.js has the advantage of being a full web-app framework, making it easy to build an accompanying web app to go
  along with your Discord app!
- Deploying on Vercel is not only simple, but it also scales out very effectively if you need to build a more complex
  app (analytics, logging, integrations, etc.)
  - You can use Next.js/Vercel features like [Dynamic Image Generation](NextBot is a template for building and deploying a Discord bot with Next.js. It runs 100% in the edge runtime so you get
lightning-fast responses and zero cold starts).
