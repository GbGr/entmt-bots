import { Injectable } from '@nestjs/common';
import { User } from '@telegraf/types';
import { DickMeasurementStore } from './dick-measurement.store';
import { getRandomIntInRange } from './aaa-dick-measurement';

@Injectable()
export class DickMeasurementService {
  constructor(
    private readonly _dickMeasurementStore: DickMeasurementStore,
  ) {
  }

  public async measure(user: User) {
    const date = this.getTodayDate();
    const result = getRandomIntInRange();

    return this._dickMeasurementStore.createUserMeasurement(date, user.id, result);
  }

  public async getTodayUserMeasurement(user: User) {
    return this._dickMeasurementStore.getUserMeasurement(this.getTodayDate(), user.id);
  }

  public getTodayTop() {
    return this._dickMeasurementStore.getMeasurementsForDate(this.getTodayDate());
  }

  private getTodayDate(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const gmtPlus3Offset = 3 * 60 * 60 * 1000;

    return today.getTime() + gmtPlus3Offset;
  }
}
