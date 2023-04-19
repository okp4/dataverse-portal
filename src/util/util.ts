import type * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'

export const getURILastElement = (str: string): O.Option<string> => pipe(str.split('/'), A.last)
