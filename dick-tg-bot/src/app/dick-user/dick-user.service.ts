import { Injectable } from '@nestjs/common';
import { DickUserStore } from './dick-user.store';
import { User } from '@telegraf/types';
import { DickMeasurement } from '../dick-measurement/dick-measurement.type';

const AVG_COUNT = 10;

@Injectable()
export class DickUserService {
  constructor(
    private readonly _dickUserStore: DickUserStore,
  ) {
  }

  public getDickUser(uid: number) {
    return this._dickUserStore.getDickUserOrThrow(uid);
  }

  public async updateUserResult(user: User, measurement: DickMeasurement) {
    const dickUser = await this._dickUserStore.getOrCreateDickUser(user);

    if (dickUser.lastMeasurements.length >= AVG_COUNT) {
      dickUser.lastMeasurements = dickUser.lastMeasurements.slice(1);
    }

    dickUser.lastMeasurements.push(measurement.result);
    dickUser.avgResult = calcAvgResult(dickUser.lastMeasurements);

    await this._dickUserStore.save(user, dickUser);

    return dickUser;
  }

  public async getAllDickUsers() {
    const dickUsers = await this._dickUserStore.getAll();

    return dickUsers.filter((dickUser) => !!dickUser.avgResult).sort((a, b) => b.avgResult - a.avgResult);
  }

}

const calcAvgResult = (measurements: Array<number>) => {
  const avg = measurements.reduce((acc, result) => acc + result, 0);

  return Math.round(avg / measurements.length * 10) / 10;
};
