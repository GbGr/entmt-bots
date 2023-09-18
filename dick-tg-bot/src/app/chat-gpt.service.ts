import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionCreateParamsBase } from 'openai/src/resources/chat/completions';

@Injectable()
export class ChatGptService {
  private readonly _openAi: OpenAI;

  constructor(
    private readonly _configService: ConfigService,
  ) {
    this._openAi = new OpenAI({
      apiKey: this._configService.get<string>('OPENAI_API_KEY'),
    });
  }

  public async simplePrompt(prompt: string, model: ChatCompletionCreateParamsBase['model'] = 'gpt-3.5-turbo') {
    const chatCompletion = await this._openAi.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model,
    });

    return (chatCompletion.choices[0].message.content) as string;
  }
}
