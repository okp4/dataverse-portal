import type { Show } from 'fp-ts/lib/Show'

export const ResourceConflictError = (resourceIds: string[]) =>
  ({
    _tag: 'resource-conflict',
    resourceIds
  } as const)

/**
 *  Error when an id of a resource to be stored already exists in memory.
 */
export type ResourceConflictError = ReturnType<typeof ResourceConflictError>

export const ResourceNotFoundError = (resourceId: string) =>
  ({
    _tag: 'resource-not-found',
    resourceId
  } as const)

/**
 *  Error when the id of a resource is not found in memory.
 */
export type ResourceNotFoundError = ReturnType<typeof ResourceNotFoundError>

export type ResourceError = ResourceConflictError | ResourceNotFoundError

export const ShowFileError: Show<ResourceError> = {
  show: (error: ResourceError): string => {
    switch (error._tag) {
      case 'resource-conflict': {
        return `Error ${
          error._tag
        }: Failed to store resource with conflicting IDs [${error.resourceIds.join(', ')}].`
      }
      case 'resource-not-found': {
        return `Error ${error._tag}: Failed to handle resource with ID '${error.resourceId}' since it does not exist.`
      }
    }
  }
}
