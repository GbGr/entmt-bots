import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInternals } from '../types/internals';
import { DickUser } from './dick-user.type';
import { User } from '@telegraf/types';

const DICK_USER_KEY = 'dick-user';

function getFullName(user: User) {
  let fullName = user.first_name;
  if (user.last_name) fullName = `${fullName} ${user.last_name}`;
  return fullName;
}

@Injectable()
export class DickUserStore {
  constructor(
    @Inject(CACHE_MANAGER) private readonly _cacheManager: CacheInternals,
  ) {
  }

  public async getAll() {
    const keys = await this._cacheManager.store.keys(`${DICK_USER_KEY}:*`);

    return Promise.all(keys.map((key) => this._cacheManager.get<DickUser>(key) as Promise<DickUser>))
  }

  public async save(user: User, dickUser: DickUser) {
    dickUser.username = user.username;
    dickUser.fullName = getFullName(user);
    await this._cacheManager.set(this.buildDickUserKey(user.id), dickUser);
  }

  public async getOrCreateDickUser(user: User) {
    let dickUser = await this.getDickUser(user);

    if (dickUser) return dickUser;

    dickUser = {
      id: user.id,
      fullName: `${user.first_name} ${user.last_name}`,
      username: user.username,
      avgResult: 0,
      joinedAt: Date.now(),
      lastMeasurements: [],
    };

    await this.save(user, dickUser);

    return dickUser;
  }

  public async getDickUserOrThrow(uid: number) {
    const dickUser = await this._cacheManager.get<DickUser>(this.buildDickUserKey(uid));

    if (!dickUser) throw new Error(`Dick user with id ${uid} not found`);

    return dickUser;
  }

  private getDickUser(user: User) {
    return this._cacheManager.get<DickUser>(this.buildDickUserKey(user.id));
  }

  private buildDickUserKey(uid: number) {
    return `${DICK_USER_KEY}:${uid}`;
  }

}
