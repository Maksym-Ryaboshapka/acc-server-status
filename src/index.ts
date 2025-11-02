import TelegramBot from "node-telegram-bot-api";
import { DBusBattery } from "./utils/getPercentage.ts";
import dotenv from "dotenv";

dotenv.config();

async function main(): Promise<void> {
  if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing");
  }

  if (!process.env.CHAT_ID) {
    throw new Error("CHAT_ID is missing");
  }

  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
  const CHAT_ID = process.env.CHAT_ID;

  await bot.sendMessage(CHAT_ID, "Bot is running");

  const percentageObj = await DBusBattery.getPercentage();

  if (!percentageObj) {
    throw new Error("Unable to get battery level");
  }

  const THRESHOLD = 15;
  const FULL = 100;

  const { props } = percentageObj;

  props.on("PropertiesChanged", (_iface, changed) => {
    if (changed.Percentage) {
      if (changed.Percentage.value === THRESHOLD) {
        bot.sendMessage(CHAT_ID, "Заряд аккумулятора сервера опустился до 15%");
      } else if (changed.Percentage.value === FULL) {
        bot.sendMessage(CHAT_ID, "Заряд аккумулятора сервера достиг 100%");
      }
    }
  });

  bot.onText(/\/acc_level/, async (): Promise<void> => {
    const percentageObj = await DBusBattery.getPercentage();

    if (!percentageObj) {
      throw new Error("Unable to get battery level");
    }

    const { percentage } = percentageObj;

    await bot.sendMessage(CHAT_ID, `Текущий заряд аккумулятора сервера ${percentage}%`);
  });
}

main();