import type { Show } from 'fp-ts/lib/Show'

export const ResourceAlreadyExistsError = (resourceIds: string[]) =>
  ({
    _tag: 'resource-already-exists',
    resourceIds
  } as const)

/**
 *  Error when an id of a resource to be stored already exists in the domain.
 */
export type ResourceAlreadyExistsError = ReturnType<typeof ResourceAlreadyExistsError>

export const ResourceNotFoundError = (resourceId: string) =>
  ({
    _tag: 'resource-not-found',
    resourceId
  } as const)

/**
 *  Error when the id of a resource is not found in the domain.
 */

export type ResourceNotFoundError = ReturnType<typeof ResourceNotFoundError>

export const ResourceWrongValueError = (value: unknown) =>
  ({
    _tag: 'resource-wrong-value',
    value
  } as const)

/**
 *  Error when the value of a resource is inconsistent.
 */

export type ResourceWrongValueError = ReturnType<typeof ResourceWrongValueError>

export type ResourceError =
  | ResourceAlreadyExistsError
  | ResourceNotFoundError
  | ResourceWrongValueError

export const ShowResourceError: Show<ResourceError> = {
  show: (error: ResourceError): string => {
    switch (error._tag) {
      case 'resource-already-exists': {
        return `Error ${
          error._tag
        }: Failed to store resource with conflicting IDs [${error.resourceIds.join(', ')}].`
      }
      case 'resource-not-found': {
        return `Error ${error._tag}: Failed to handle resource with ID '${error.resourceId}' since it does not exist.`
      }
      case 'resource-wrong-value': {
        return `Error ${error._tag}: Failed to handle resource with value '${error.value}' since it an inconsistent one.`
      }
    }
  }
}
