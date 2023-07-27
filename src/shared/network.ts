import type { Show } from 'fp-ts/lib/Show'

type HTTPNetworkErrorCtx = Readonly<{
  errorCode: number
  reason: string
}>

export const HTTPNetworkError = ({ errorCode, reason }: HTTPNetworkErrorCtx) =>
  ({
    _tag: 'network-http',
    errorCode,
    reason
  } as const)

/**
 *  Error when a HTTP newtwork response is not OK.
 */
export type HTTPNetworkError = ReturnType<typeof HTTPNetworkError>

export const NetworkUnspecifiedError = (reason: string) =>
  ({
    _tag: 'network-unspecified',
    reason
  } as const)

/**
 *  Error when a HTTP response is OK but there is a unspecified network error.
 */
export type NetworkUnspecifiedError = ReturnType<typeof NetworkUnspecifiedError>

export const NetworkRequestAbortedError = (reason: string) =>
  ({
    _tag: 'network-request-aborted',
    reason
  } as const)

/**
 *  Error when a newtwork request has been aborted.
 */
export type NetworkRequestAbortedError = ReturnType<typeof NetworkRequestAbortedError>

export type NetworkError = HTTPNetworkError | NetworkUnspecifiedError | NetworkRequestAbortedError

export const ShowFileError: Show<NetworkError> = {
  show: (error: NetworkError): string => {
    switch (error._tag) {
      case 'network-http': {
        return `Error ${error._tag}: An HTTP network error occurred with the following code <${error.errorCode}> and the following reason <${error.reason}>`
      }
      case 'network-unspecified': {
        return `Error ${error._tag}: An unspecified HTTP network error occurred with the following reason <${error.reason}>`
      }
      case 'network-request-aborted':
        return `Error ${error._tag}: The request has been aborted with the following reason <${error.reason}>`
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isHTTPNetworkError = (error: any): error is HTTPNetworkError =>
  '_tag' in error && error._tag === 'network-http'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNetworkRequestAbortedError = (error: any): error is NetworkRequestAbortedError =>
  '_tag' in error && error._tag === 'network-request-aborted'
