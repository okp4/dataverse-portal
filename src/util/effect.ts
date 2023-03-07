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
export const toEffectful = <T>(v: T): ToEffectful<T> => {
  if (typeof v !== 'function') {
    return v as ToEffectful<T>
  }

  return ((...args: unknown[]) => {
    const result = v(...args)

    if (typeof result === 'function') {
      return result()
    }

    return result
  }) as ToEffectful<T>
}
