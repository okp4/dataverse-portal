export type PartialDateTimeFormatOptions = Pick<
  Intl.DateTimeFormatOptions,
  'year' | 'month' | 'day'
>

export const formatDateToPattern = (
  pattern: Record<keyof PartialDateTimeFormatOptions, string>,
  options: PartialDateTimeFormatOptions,
  locale: string = 'en-US'
): string =>
  new Intl.DateTimeFormat(locale, options)
    .formatToParts()
    .map(({ type, value }) =>
      type in pattern ? pattern[type as keyof PartialDateTimeFormatOptions] : value
    )
    .join('')
