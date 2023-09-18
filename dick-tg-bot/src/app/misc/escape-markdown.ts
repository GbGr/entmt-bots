export function escapeMarkdown(text: string) {
  return text.replace(/([\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}
