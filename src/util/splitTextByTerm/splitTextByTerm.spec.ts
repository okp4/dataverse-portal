import { splitTextByTerm } from './splitTextByTerm'

describe('splitTextByTerm', () => {
  it('splits text by the search term', () => {
    const result = splitTextByTerm('Hello world', 'world')
    expect(result).toEqual(['Hello ', 'world'])
  })

  it('is case insensitive', () => {
    const result = splitTextByTerm('Hello World', 'world')
    expect(result).toEqual(['Hello ', 'World'])
  })

  it('handles multiple instances of the search term', () => {
    const result = splitTextByTerm('worldworld world', 'world')
    expect(result).toEqual(['world', 'world', ' ', 'world'])
  })

  it('returns the original text when the search term is not found', () => {
    const result = splitTextByTerm('Hello world', 'test')
    expect(result).toEqual(['Hello world'])
  })

  it('returns the original text when the search term is empty', () => {
    const result = splitTextByTerm('Hello world', '')
    expect(result).toEqual(['Hello world'])
  })
})
