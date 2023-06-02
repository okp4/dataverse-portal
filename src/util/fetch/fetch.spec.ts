import { createAbortableFetch } from './fetch'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

describe('fetch utilities', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })
  describe('createAbortableFetch', () => {
    test('aborts previous request', async () => {
      const responseBody = { result: 'ok' }
      fetchMock.mockRejectOnce(async () => Promise.reject(new Error('The user aborted a request.')))
      fetchMock.mockResponseOnce(JSON.stringify(responseBody), { status: 200 })

      const abortableFetch = createAbortableFetch()

      // Make first request
      const firstRequest = abortableFetch('https://example.com')
      // Make second request, which should abort the first one
      const secondRequest = abortableFetch('https://example.com')

      // Check that the first request is aborted.
      await expect(firstRequest).rejects.toThrow('The user aborted a request.')

      // Check that the second request finishes with a status code of 200.
      const secondResponse = await secondRequest
      expect(await secondResponse.json()).toEqual(responseBody)
    })
  })
})
