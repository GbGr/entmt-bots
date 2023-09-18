export interface DickUser {
  id: number;
  fullName: string;
  username: string | undefined;
  joinedAt: number;
  avgResult: number;
  lastMeasurements: Array<number>;
}
