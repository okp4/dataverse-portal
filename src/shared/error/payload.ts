import type { Show } from 'fp-ts/lib/Show'

export const PayloadIsEmptyError = () =>
  ({
    _tag: 'payload-is-empty'
  } as const)

/**
 * Error when a payload that is expected to contain data is empty.
 */
export type PayloadIsEmptyError = ReturnType<typeof PayloadIsEmptyError>

export type PayloadError = PayloadIsEmptyError

export const ShowPayloadError: Show<PayloadError> = {
  show: (error: PayloadError): string => {
    switch (error._tag) {
      case 'payload-is-empty': {
        return `Error ${error._tag}: Failed to execute command with an empty payload.`
      }
    }
  }
}
