import { Cache, Store } from 'cache-manager';
import { RedisClientType } from 'redis';

export interface CacheInternals extends Cache {
  store: RedisStore;
}

interface RedisStore extends Store {
  client: RedisClientType;
}
