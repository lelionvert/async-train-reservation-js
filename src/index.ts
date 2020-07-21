import * as allSettled from "promise.allsettled";
import { PromiseResult, PromiseResolution } from "promise.allsettled";

export type TrainId = string;

export interface ReservationOption {
  coach: number;
  seat: number;
}

export interface Api {
  getAvailableTrains(): Promise<TrainId[]>;
  getAvailableSeats(trainId: string): Promise<ReservationOption[]>;
}

export async function getReservationOptions({
  getAvailableTrains,
  getAvailableSeats
}: Api): Promise<ReservationOption[]> {
  const availableTrainsIds = await getAvailableTrains();
  return allSettled(availableTrainsIds.map(getAvailableSeats)).then(results =>
    results
      .filter(isFulfilled)
      .map(getOptions)
      .reduce(merge, [])
  );
}

function isFulfilled(result: PromiseResult<ReservationOption[]>): result is PromiseResolution<ReservationOption[]> {
  return result.status === "fulfilled";
}

function getOptions({ value }: PromiseResolution<ReservationOption[]>): ReservationOption[] {
  return value;
}

function merge<T>(acc: T[], cur: T[]): T[] {
  return [...acc, ...cur];
}
