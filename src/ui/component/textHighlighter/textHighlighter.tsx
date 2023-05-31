import type { FC } from 'react'
import { splitTextWithTerm } from '@/util/splitTextWithTerm/splitTextWithTerm'

type TextHighlighterProps = {
  text: string
  termToHighlight: string
  highlightClassName: string
}
export const TextHighlighter: FC<TextHighlighterProps> = ({
  text,
  termToHighlight,
  highlightClassName
}) => {
  const parts = splitTextWithTerm(text, termToHighlight)

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === termToHighlight.toLowerCase() ? (
          <span className={highlightClassName} key={index}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}
