import type { Task } from 'fp-ts/Task'
import type { IO } from 'fp-ts/IO'

// ToEffectful is a utility type that converts a computational function (i.e a function that returns an IO or a Task) to a function that returns
// its result directly (producing a side effect), else it returns the same type.
export type ToEffectful<T> = T extends (...args: infer Args) => IO<infer R>
  ? (...args: Args) => R
  : T extends (...args: infer Args) => Task<infer R>
  ? (...args: Args) => Promise<R>
  : T

// toEffectful is an utility function that converts a computational function (i.e a function that returns an IO or a Task) to a function that returns
// its result directly (producing a side effect), else it does nothing.
export const toEffectful = <T>(v: T): ToEffectful<T> =>
  typeof v !== 'function'
    ? (v as ToEffectful<T>)
    : (((...args: unknown[]) => {
        const result = v(...args)

        return typeof result === 'function' ? result() : result
      }) as ToEffectful<T>)

// ToEffectfulObject is a utility type that converts a computational object (i.e an object that contains computational functions) to an object that
// contains functions that return their result directly (producing a side effect), leaving the type of the other properties unmodified.
export type ToEffectfulObject<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => IO<infer R>
    ? (...args: Args) => R
    : T[K] extends (...args: infer Args) => Task<infer R>
    ? (...args: Args) => Promise<R>
    : T[K]
}

// toEffectfulObject is an utility function that converts a computational object (i.e an object that contains computational functions) to an object that
// contains functions that return their result directly (producing a side effect), leaving the rest of the object untouched.
export function toEffectfulObject<T extends Record<string, unknown>>(obj: T): ToEffectfulObject<T> {
  return Object.keys(obj).reduce(
    (result: Record<string, unknown>, key: string) => ({
      ...result,
      [key]: toEffectful(obj[key])
    }),
    {}
  ) as ToEffectfulObject<T>
}
