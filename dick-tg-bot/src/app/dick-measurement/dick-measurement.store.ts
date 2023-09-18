import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInternals } from '../types/internals';
import { DickMeasurement } from './dick-measurement.type';

const MEASUREMENT_CACHE_KEY = 'dick-measurement';

@Injectable()
export class DickMeasurementStore {
  constructor(
    @Inject(CACHE_MANAGER) private readonly _cacheManager: CacheInternals,
  ) {
  }

  public async createUserMeasurement(date: number, uid: number, result: number) {
    const dickMeasurement: DickMeasurement = {
      uid,
      at: Date.now(),
      result,
    };

    await this._cacheManager.set(`${MEASUREMENT_CACHE_KEY}:${date}:${uid}`, dickMeasurement);

    return dickMeasurement;
  }

  public async getUserMeasurement(date: number, uid: number) {
    return this._cacheManager.get<DickMeasurement>(`${MEASUREMENT_CACHE_KEY}:${date}:${uid}`);
  }

  public async getMeasurementsForDate(date: number): Promise<Array<DickMeasurement>> {
    const measurementKeys = await this._cacheManager.store.keys(`${MEASUREMENT_CACHE_KEY}:${date}:*`);
    const measurementsPromises = measurementKeys.map((key) => {
      return this._cacheManager.get<DickMeasurement>(key) as Promise<DickMeasurement>;
    });

    return Promise.all(measurementsPromises);
  }
}
