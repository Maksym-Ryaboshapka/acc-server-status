import TelegramBot from "node-telegram-bot-api";
import { DBusBattery } from "./utils/getPercentage.ts";
import { configDotenv } from "dotenv";

configDotenv();

async function main(): Promise<void> {
  if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing");
  }

  if (!process.env.CHAT_ID) {
    throw new Error("CHAT_ID is missing");
  }

  const bot = new TelegramBot(process.env.BOT_TOKEN);
  const CHAT_ID = process.env.CHAT_ID;

  const percentageObj = await DBusBattery.getPercentage();

  if (!percentageObj) {
    throw new Error("Unable to get battery level");
  }

  const { props } = percentageObj;

  props.on("PropertiesChanged", (_iface, changed) => {
    if (changed.Percentage) {
      bot.sendMessage(CHAT_ID, changed.Percentage);
    }
  });
}

main();