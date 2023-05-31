import { splitTextWithTerm } from './splitTextWithTerm'

describe('splitTextWithTerm', () => {
  it('splits text with the search term', () => {
    const result = splitTextWithTerm('Hello world', 'world')
    expect(result).toEqual(['Hello ', 'world'])
  })

  it('is case insensitive', () => {
    const result = splitTextWithTerm('Hello World', 'world')
    expect(result).toEqual(['Hello ', 'World'])
  })

  it('handles multiple instances of the search term', () => {
    const result = splitTextWithTerm('worldworld world', 'world')
    expect(result).toEqual(['world', 'world', ' ', 'world'])
  })

  it('returns the original text when the search term is not found', () => {
    const result = splitTextWithTerm('Hello world', 'test')
    expect(result).toEqual(['Hello world'])
  })

  it('returns the original text when the search term is empty', () => {
    const result = splitTextWithTerm('Hello world', '')
    expect(result).toEqual(['Hello world'])
  })

  it('returns an empty array when the text is empty', () => {
    const result = splitTextWithTerm('', 'world')
    expect(result).toEqual([])
  })

  it('handles special characters in the search term', () => {
    const result = splitTextWithTerm('hello world', '\\x')
    expect(result).toEqual(['hello world'])
  })

  it('handles emojis in the text and the search term', () => {
    const result = splitTextWithTerm('hello 😊 world', '😊')
    expect(result).toEqual(['hello ', '😊', ' world'])
  })

  it('splits text by the search term when the term contains special characters', () => {
    const result = splitTextWithTerm('hello . world', '.')
    expect(result).toEqual(['hello ', '.', ' world'])
  })
})
