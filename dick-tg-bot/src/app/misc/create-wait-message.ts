import { Scenes } from 'telegraf';
import { messages } from './processing-messages.json'
import { escapeMarkdown } from './escape-markdown';

export const createWaitMessage = async (ctx: Scenes.SceneContext) => {
  const msg = await ctx.reply({
    parse_mode: 'MarkdownV2',
    text: `${getRandomMessage()}\n⌛⌛⌛`,
  } as any);
  await ctx.sendChatAction('typing');

  return msg;
}

const getRandomMessage = () => {
  const idx = Math.floor(Math.random() * messages.length);
  return escapeMarkdown(messages[idx]);
}
