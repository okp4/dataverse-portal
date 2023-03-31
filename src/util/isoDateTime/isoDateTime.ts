const getLocalizedYear = (date: Date, locale: string): string => {
  const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric' })
  return formatter.format(date)
}

export const isISODateTime = (input: string): boolean => {
  const isoDateTimeRegex: RegExp =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(([+-])(\d{2}):(\d{2})|Z)?$/

  return isoDateTimeRegex.test(input) && new Date(input).toString() !== 'Invalid Date'
}

export const convertToLocalizedYearIfISODateTime = (input: string, locale: string): string => {
  return isISODateTime(input) ? getLocalizedYear(new Date(input), locale) : input
}
