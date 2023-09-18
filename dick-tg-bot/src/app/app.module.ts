import { Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { DickBotService } from './dick-bot.service';
import { DickUserService } from './dick-user/dick-user.service';
import { DickMeasurementService } from './dick-measurement/dick-measurement.service';
import { DickMeasurementStore } from './dick-measurement/dick-measurement.store';
import { DickUserStore } from './dick-user/dick-user.store';
import { ChatGptService } from './chat-gpt.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        ttl: 0,
        url: configService.get('REDIS_URL'),
      }),
      inject: [ ConfigService ],
    }),
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow('DICK_TG_BOT_API_KEY'),
      }),
      inject: [ ConfigService ],
    }),
  ],
  controllers: [],
  providers: [ ChatGptService, DickBotService, DickMeasurementStore, DickUserStore, DickUserService, DickMeasurementService ],
})
export class AppModule {
}
