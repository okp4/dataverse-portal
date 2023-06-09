export const createAbortableFetch = (): {
  fetchWithAbort: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  abortRequest: () => void
} => {
  let abortController: AbortController | undefined

  return {
    async fetchWithAbort(input: RequestInfo, init?: RequestInit): Promise<Response> {
      abortController?.abort()
      abortController = new AbortController()
      const fetchInit = { ...init, signal: abortController.signal }
      return fetch(input, fetchInit)
    },
    abortRequest: (): void => {
      abortController?.abort()
    }
  }
}
