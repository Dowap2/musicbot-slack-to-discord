import express from "express";
import { WebClient } from "@slack/web-api";
import { createEventAdapter } from "@slack/events-api";
import { createServer } from "http";
import CONFIG from "../config/bot.json";
import Discord from "discord.js";
import token from "../config/discordToken.json";

const client = new Discord.Client();

function playMusic(url) {
  client.once("message", msg => {
    msg.member.voice.channel.join().then(connection => {
      msg.reply("playing music!");
      const dispatcher = connection.play("../mp3/내손을잡아");
      console.log("play start");
      dispatcher.on("end", end => {});
    });
    msg.channel.send(url);
  });
  client.login(token.token);
}
const app = express();

const slackEvents = createEventAdapter(CONFIG.SIGNING_SECRET);
const webClient = new WebClient(CONFIG.BOT_USER_OAUTH_ACCESS_TOKEN);

slackEvents.on("message", async event => {
  console.log(event.text);
  const command = String(event.text).slice(0, 5);
  const url = String(event.text).slice(5);
  if (command == "!play") {
    webClient.chat.postMessage({
      text: url,
      channel: event.channel
    });
    playMusic(url);
  }
});

app.use("/slack/events", slackEvents.requestListener());

createServer(app).listen(6000, () => {
  console.log("run slack bot");
});
