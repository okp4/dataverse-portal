import 'web-streams-polyfill'

jest.mock('@/util/env.util', () => ({
  isDevMode: () => false
}))
