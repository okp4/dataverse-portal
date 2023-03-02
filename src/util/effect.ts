import type { Task } from 'fp-ts/Task'
import type { IO } from 'fp-ts/IO'

// Defines the type of function that returns an IO or a Task also known as a computational function.
export type ComputationalFunc = (...args: unknown[]) => IO<unknown> | Task<unknown>

// toEffectful is an utility function that converts a computational function (i.e a function that returns an IO or a Task) to a function that returns
// its result directly (producing a side effect).
export const toEffectful =
  <F extends ComputationalFunc> (
    fn: F
  ): ((
    ...args: Parameters<F>
  ) => ReturnType<F> extends IO<infer T>
    ? T
    : ReturnType<F> extends Task<infer U>
    ? Promise<U>
    : never) =>
  (...args: Parameters<F>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn(...args)() as any
