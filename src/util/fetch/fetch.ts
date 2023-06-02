export const FetchAbortError = (): Error => {
  const error = new Error()
  error.name = 'AbortError'
  return error
}

export const handleAbortError = (error: Error): Error => {
  if (error.name === 'AbortError') {
    console.info('Request aborted')
    throw FetchAbortError()
  }
  throw error
}

export const createAbortableFetch = (): ((
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>) => {
  let abortController = new AbortController()

  const fetchWithAbort: (input: RequestInfo, init?: RequestInit) => Promise<Response> = async (
    input,
    init
  ) => {
    // Cancel the previous fetch request
    abortController.abort()

    // Create a new AbortController for the new fetch request
    abortController = new AbortController()

    const fetchInit: RequestInit = {
      ...init,
      signal: abortController.signal // Using abortController's signal
    }

    return fetch(input, fetchInit)
  }

  return fetchWithAbort
}
