export const FetchAbortError = (): Error => {
  const error = new Error()
  error.name = 'AbortError'
  return error
}

export const handleAbortError = (error: Error): Error => {
  if (error.name === 'AbortError') {
    console.info('Request aborted')
    return FetchAbortError()
  }
  return error
}

export const createAbortableFetch = (): {
  fetchWithAbort: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  abortRequest: () => void
} => {
  let abortController = new AbortController()

  return {
    async fetchWithAbort(input: RequestInfo, init?: RequestInit): Promise<Response> {
      abortController.abort() // Cancel the previous fetch request
      abortController = new AbortController() // Create a new AbortController for the new fetch request
      const fetchInit = { ...init, signal: abortController.signal }
      return fetch(input, fetchInit)
    },
    abortRequest: (): void => {
      abortController.abort()
    }
  }
}
