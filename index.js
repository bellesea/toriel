const { App } = require("@slack/bolt")
const { transcript } = require("./util/transcript")

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

app.command('/toriel-call2', require('./commands/call'))
app.command(/\/.*/, async (args) => {
  const { ack, payload, respond } = args
  const { command, text } = payload

  await ack()

  await respond({
    blocks: [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `${command} ${text}`
          }
        ]
      }
    ]
  })

  switch (command) {
    case '/toriel-call':
      await require(`./commands/call`)(args)
      break;
  
    default:
      await require('./commands/not-found')(args)
      break;
  }
})

var botSelfCache
async function botInfo() {
  return botSelfCache ? botSelfCache : (botSelfCache = await app.client.bots.info({
    token: process.env.SLACK_BOT_TOKEN,
  }))
}

app.start(process.env.PORT || 3000).then(async () => {
  console.log(transcript('startupLog'))
  
  // check if in #cave channel
  // console.log(await botInfo())
  // console.log(await botInfo())
})