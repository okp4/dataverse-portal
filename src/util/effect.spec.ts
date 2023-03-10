/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/promise-function-async */
import { toEffectful, toEffectfulObject } from './effect'
import type { IO } from 'fp-ts/lib/IO'
import type { IOEither } from 'fp-ts/lib/IOEither'
import type { Task } from 'fp-ts/lib/Task'
import * as IOE from 'fp-ts/IOEither'
import * as E from 'fp-ts/Either'

describe('Considering the toEffectul() function', () => {
  describe.each`
    desc                                             | fn                                                      | args         | expectedResult
    ${'an IO function that returns a string'}        | ${(): IO<string> => () => 'foo'}                        | ${[]}        | ${'foo'}
    ${'an IOEither function that returns a string'}  | ${(v: string): IOEither<never, string> => IOE.right(v)} | ${['foo']}   | ${E.right('foo')}
    ${'a Task function that returns a number'} | ${(v: number): Task<number> =>
  () => Promise.resolve(v)} | ${[42]} | ${42}
    ${'an effectful function that returns a number'} | ${(v: number): number => v}                             | ${[42]}      | ${42}
    ${'a value'}                                     | ${'foo'}                                                | ${undefined} | ${'foo'}
  `(
    'Given the test case <$desc>',
    ({
      fn,
      args,
      expectedResult
    }: {
      fn: (...args: unknown[]) => unknown | unknown
      args: unknown[] | undefined
      expectedResult: unknown
    }) => {
      describe('When calling function toEffectful()', () => {
        const effectfulFn = toEffectful(fn)

        if (args === undefined) {
          test(`Then, the result is as expected`, () => {
            expect(effectfulFn).toEqual(expectedResult)
          })
        } else {
          test(`Then, the result is a function`, () => {
            expect(typeof effectfulFn).toEqual('function')
          })

          describe(`And when calling that function`, () => {
            const result = effectfulFn(...args)

            test(`Then, the result is as expected`, async () => {
              // check if result is a promise
              if (result instanceof Promise) {
                const value = await result

                expect(value).toEqual(expectedResult)
              } else {
                expect(result).toEqual(expectedResult)
              }
            })
          })
        }
      })
    }
  )
})

describe('Considering the toEffectulObject() function', () => {
  describe('When calling function toEffectfulObject()', () => {
    const obj = {
      a: (): IO<string> => () => 'foo',
      b:
        (v: string): IO<string> =>
        () =>
          v,
      c:
        (v: number): Task<number> =>
        () =>
          Promise.resolve(v),
      d: (v: number): number => v,
      e: 'foo'
    }

    const result: {
      a: () => string
      b: (v: string) => string
      c: (v: number) => Promise<number>
      d: (v: number) => number
      e: string
    } = toEffectfulObject(obj)
    test(`Then, the result is as expected`, () => {
      expect(result.a()).toEqual('foo')
      expect(result.b('bar')).toEqual('bar')
      expect(result.c(42)).resolves.toEqual(42)
      expect(result.d(42)).toEqual(42)
      expect(result.e).toEqual('foo')
    })
  })
})
