import type { FC } from 'react'
import { splitTextByTerm } from '@/util/splitTextByTerm/splitTextByTerm'

type TextHighlighterProps = {
  text: string
  termToHighlight: string
}
export const TextHighlighter: FC<TextHighlighterProps> = ({
  text,
  termToHighlight: textToHighlight
}) => {
  const parts = splitTextWithTerm(text, termToHighlight)

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === textToHighlight.toLowerCase() ? (
          <span className="text-highlight" key={index}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}
