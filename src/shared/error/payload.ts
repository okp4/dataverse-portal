import type { Show } from 'fp-ts/lib/Show'

export const PayloadIsEmptyError = (payload: unknown) =>
  ({
    _tag: 'payload-is-empty',
    payload
  } as const)

/**
 *  Error when an empty payload does not satisfy the constraints
 * */

export type PayloadIsEmptyError = ReturnType<typeof PayloadIsEmptyError>

export type PayloadError = PayloadIsEmptyError

export const ShowPayloadError: Show<PayloadError> = {
  show: (error: PayloadError): string => {
    switch (error._tag) {
      case 'payload-is-empty': {
        return `Error ${
          error._tag
        }: Failed to execute command with an empty payload: ${JSON.stringify(error.payload)}.`
      }
    }
  }
}
