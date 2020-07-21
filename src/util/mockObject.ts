type RecursivePartial<T> = { [P in keyof T]?: T[P] | RecursivePartial<T[P]> };

export function mockObject<T extends Record<string | number, any>>(partialObject: RecursivePartial<T> = {}): T {
  return new Proxy(partialObject, {
    get: (target: T, p: string | number) => {
      if (target[p] !== undefined) {
        return target[p];
      }
      return mockObject();
    },
    set: () => {
      throw new Error(`A mocked object shall not be mutated`);
    }
  }) as T;
}
