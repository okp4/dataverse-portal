import {
  HTTPNetworkError,
  NetworkRequestAbortedError,
  NetworkUnspecifiedError,
  isHTTPNetworkError
} from '@/shared/error/network'
import { SerializationError } from '@/shared/error/serialize'
import { createAbortableFetch } from '@/util/fetch/fetch'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'
import * as I from 'fp-ts/Identity'
import { flow, pipe } from 'fp-ts/lib/function'
import { extractErrorMessage, isError } from '@/util/util'

const { fetchWithAbort } = createAbortableFetch()

const sparqlFetchHeaders = (query: string): RequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/sparql-results+json'
  },
  body: `query=${encodeURIComponent(query)}`
})

export const fetchWithSparql = (
  query: string
): TE.TaskEither<
  HTTPNetworkError | NetworkUnspecifiedError | NetworkRequestAbortedError,
  Response
> =>
  TE.tryCatch(
    async () => {
      const resp = await fetchWithAbort(APP_ENV.sparql['endpoint'], sparqlFetchHeaders(query))
      if (!resp.ok) {
        const rawMessage = await resp.text()
        throw HTTPNetworkError({ errorCode: resp.status, reason: resp.statusText, rawMessage })
      }
      return resp
    },
    error =>
      pipe(
        error,
        O.fromPredicate(isHTTPNetworkError),
        O.matchW(
          () =>
            pipe(
              error,
              O.fromPredicate(isError),
              O.flatMap(flow(O.fromPredicate(e => e.name === 'AbortError'))),
              O.matchW(
                () => {
                  const message = extractErrorMessage(error)
                  return NetworkUnspecifiedError(message)
                },
                r => NetworkRequestAbortedError(r.message)
              )
            ),
          I.of
        )
      )
  )

export const serializeFetchResponse = <T>(
  response: Response
): TE.TaskEither<SerializationError, T> =>
  TE.tryCatch(
    async () => response.json(),
    error => {
      const message = extractErrorMessage(error)
      return SerializationError(message)
    }
  )
