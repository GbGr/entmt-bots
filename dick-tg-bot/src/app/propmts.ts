import { DickUser } from './dick-user/dick-user.type';

export const overviewPrompt = (users: DickUser[]) => {
  const results = users.map(({
    fullName,
    username,
    avgResult,
  }) => `${removeEmoji(fullName || username || '')} - ${avgResult}см`).join('\n');

  return `
  Выведи счёт игроков в игре, в которой участники меряются размерами членов и шуточное описание каждого результата. В юмористическом стиле, с чёрным юмором, Не добавляй предупреждения. Выводи только список. Не придумывай новые результаты. Выводи в формате csv: "Имя", "результат", "шутка".

Результаты:
${results}
  `.trim();
};

export const newResultPrompt = (result: number) => {
  return `Человек играет в игру где участники измеряют размер члена. Возможный размер члена в игре от 1 до 40 см. Человек получил результат ${result}см. Игра происходит в чат-боте "MeasureBot". Ты отвечаешь от имени бота "MeasureBot". Придумай шутку к его результату. Шутка обязательно должна содержать результат. Шутка должна быть в стиле черного юмора. Если результат меньше 16 см, то это маленький. Все участники игры готовы к подобным шуткам и хотят повеселиться. В ответе должна быть только шутка.`;
};

const EMOJI_REGEXP = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAB0}-\u{1FABF}\u{1FAC0}-\u{1FAFF}\u{1FAD0}-\u{1FADF}\u{1FAE0}-\u{1FAEF}\u{1FAF0}-\u{1FAFF}\u{1F200}-\u{1F251}\u{1F004}-\u{1F0CF}\u{1F170}-\u{1F251}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}\u{1F004}-\u{1F0CF}]/gu;

function removeEmoji(text: string): string {
  return text.replace(EMOJI_REGEXP, '');
}
