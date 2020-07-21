import { ReservationOption, Api, getReservationOptions } from ".";
import { mockObject } from "./util/mockObject";

it("should return an empty array in case there is no available train", async function() {
  // GIVEN
  const api = mockObject<Api>({
    getAvailableTrains: jest.fn().mockResolvedValueOnce([]),
    getAvailableSeats: jest.fn().mockResolvedValueOnce([])
  });

  // WHEN
  const actual: ReservationOption[] = await getReservationOptions(api);

  // THEN
  expect(actual).toEqual([]);
});

it("should return an array of 2 reservation options in case there is one available train with 2 seats left", async function() {
  // GIVEN
  const api = mockObject<Api>({
    getAvailableTrains: jest.fn().mockResolvedValueOnce(["trainId"]),
    getAvailableSeats: jest.fn().mockImplementationOnce(id =>
      id === "trainId"
        ? Promise.resolve([
            { coach: 1, seat: 1 },
            { coach: 1, seat: 2 }
          ])
        : Promise.resolve([])
    )
  });

  // WHEN
  const actual: ReservationOption[] = await getReservationOptions(api);

  // THEN
  const expected: ReservationOption[] = [
    { coach: 1, seat: 1 },
    { coach: 1, seat: 2 }
  ];
  expect(actual).toEqual(expected);
});

it("should return an array of 3 reservation options in case there is one available train with 2 seats left and another with 1 seat left", async function() {
  // GIVEN
  const api = mockObject<Api>({
    getAvailableTrains: jest.fn().mockResolvedValueOnce(["trainId_0", "trainId_1"]),
    getAvailableSeats: jest.fn().mockImplementation(id => {
      switch (id) {
        case "trainId_0":
          return Promise.resolve([
            { coach: 1, seat: 1 },
            { coach: 1, seat: 2 }
          ]);
        case "trainId_1":
          return Promise.resolve([{ coach: 17, seat: 110 }]);
        default:
          return [];
      }
    })
  });

  // WHEN
  const actual: ReservationOption[] = await getReservationOptions(api);

  // THEN
  const expected: ReservationOption[] = [
    { coach: 1, seat: 1 },
    { coach: 1, seat: 2 },
    { coach: 17, seat: 110 }
  ];
  expect(actual).toEqual(expected);
});

it("should be resilient to failures of the second endpoint", async function() {
  // GIVEN
  const api = mockObject<Api>({
    getAvailableTrains: jest.fn().mockResolvedValueOnce(["trainId_0", "trainId_1"]),
    getAvailableSeats: jest.fn().mockImplementation(id => {
      switch (id) {
        case "trainId_0":
          return Promise.reject("Error 500");
        case "trainId_1":
          return Promise.resolve([{ coach: 17, seat: 110 }]);
        default:
          return [];
      }
    })
  });

  // WHEN
  const actual: ReservationOption[] = await getReservationOptions(api);

  // THEN
  const expected: ReservationOption[] = [{ coach: 17, seat: 110 }];
  expect(actual).toEqual(expected);
});
