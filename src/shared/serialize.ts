import type { Show } from 'fp-ts/lib/Show'

export const ResponseToJsonSerializationError = (reason: unknown) =>
  ({
    _tag: 'json-response-serialization',
    reason
  } as const)

/**
 *  Error when a Fetch Response fails to be asynchronously serialized to JSON
 */
export type ResponseToJsonSerializationError = ReturnType<typeof ResponseToJsonSerializationError>

export type SerializationError = ResponseToJsonSerializationError

export const ShowSerializationError: Show<SerializationError> = {
  show: (error: SerializationError): string => {
    switch (error._tag) {
      case 'json-response-serialization': {
        return `Error ${
          error._tag
        }: Failed to asynchronously serialize the fetch response to JSON with the following reason <${JSON.stringify(
          error.reason
        )}>`
      }
    }
  }
}
