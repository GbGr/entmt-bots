import { Scenes } from 'telegraf';

export const createWaitMessage = async (ctx: Scenes.SceneContext) => {
  return ctx.reply({
    parse_mode: 'MarkdownV2',
    text: 'Считаю\\.\\.\\.',
  } as any);
}
