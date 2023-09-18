import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { DickMeasurementService } from './dick-measurement/dick-measurement.service';
import { DickUserService } from './dick-user/dick-user.service';
import { DickUser } from './dick-user/dick-user.type';
import { ChatGptService } from './chat-gpt.service';
import { newResultPrompt, overviewPrompt } from './propmts';
import { createWaitMessage } from './misc/create-wait-message';
import { escapeMarkdown } from './misc/escape-markdown';

@Update()
export class DickBotService {
  constructor(
    private readonly _dickMeasurementService: DickMeasurementService,
    private readonly _dickUserService: DickUserService,
    private readonly _chatGptService: ChatGptService,
  ) {
  }

  @Command('measure')
  public async measure(@Ctx() ctx: Scenes.SceneContext) {
    const user = ctx.from!;
    const waitMessage = await createWaitMessage(ctx);
    const todayUserMeasurement = await this._dickMeasurementService.getTodayUserMeasurement(user);

    // if (todayUserMeasurement) {
    //   await ctx.telegram.editMessageText(ctx.chat!.id, waitMessage.message_id, undefined, `Замер уже был произведён, результат ${todayUserMeasurement.result}см`);
    //   return;
    // }

    const userMeasurement = await this._dickMeasurementService.measure(user);
    const dickUser = await this._dickUserService.updateUserResult(user, userMeasurement);
    const resultText = await this._chatGptService.simplePrompt(newResultPrompt(userMeasurement.result));
    const text = `*Результат замера [${escapeMarkdown(user.first_name || user.username || '')}](tg://user?id=${user.id}): ${userMeasurement.result}см*\n\`Средний результат: ${escapeMarkdown(String(dickUser.avgResult))}\`\n\n_${escapeMarkdown(resultText)}_`;

    await ctx.telegram.editMessageText(ctx.chat!.id, waitMessage.message_id, undefined, {
      parse_mode: 'MarkdownV2',
      text,
    } as any);
  }

  @Command('top')
  public async top(@Ctx() ctx: Scenes.SceneContext) {
    const todayTop = await this._dickMeasurementService.getTodayTop();

    if (todayTop.length === 0) {
      await ctx.reply('Ещё никто не замерялся сегодня');
      return;
    }

    const topDickUsers = await Promise.all(todayTop.map(({ uid }) => this._dickUserService.getDickUser(uid)));
    const topDickUsersMap = new Map<number, DickUser>();
    for (const dickUser of topDickUsers) topDickUsersMap.set(dickUser.id, dickUser);

    const text = todayTop
      .sort((a, b) => b.result - a.result)
      .map(({
        result,
        uid,
      }, idx) => `*${idx + 1}\\.* [${topDickUsersMap.get(uid)!.fullName}](tg://user?id=${uid}) ${result}см`).join('\n')

    await ctx.reply({
      parse_mode: 'MarkdownV2',
      text,
    } as any);
  }

  @Command('overall')
  public async overall(@Ctx() ctx: Scenes.SceneContext) {
    const waitMessage = await createWaitMessage(ctx);
    const users = await this._dickUserService.getAllDickUsers();
    const answer = await this._chatGptService.simplePrompt(overviewPrompt(users))
    const data = parseCsv(answer);

    try {
      const text = data.map(([ name, result, text ]) => `*${escapeMarkdown(name)} \\- ${escapeMarkdown(result)}*\n${escapeMarkdown(text)}`).join('\n\n');

      await ctx.telegram.editMessageText(ctx.chat!.id, waitMessage.message_id, undefined, {
        parse_mode: 'MarkdownV2',
        text,
      } as any);
    } catch (e) {
      await ctx.telegram.editMessageText(ctx.chat!.id, waitMessage.message_id, undefined, {
        parse_mode: 'MarkdownV2',
        text: escapeMarkdown(`Ой-ой, кажется, мои датчики перегрелись от ваших амбиций! Попробуйте снова, но без фантазий!`),
      } as any);
    }

  }
}

function parseCsv(data: string): Array<Array<string>> {
  const lines = data.trim().split('\n');
  const players = new Array<Array<string>>();

  for (let line of lines) {
    const columns: string[] = [];
    let buffer = '';
    let inQuote = false;

    for (let char of line) {
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        columns.push(buffer.trim());
        buffer = '';
      } else {
        buffer += char;
      }
    }
    columns.push(buffer.trim());

    players.push(columns.map(item => item.replace(/^"|"$/g, '')));
  }

  return players;
}
