const getYearFromISODateTime = (ISODateTime: string, locale: string): string => {
  const date = new Date(ISODateTime)
  const formatter = new Intl.DateTimeFormat(locale, { year: 'numeric' })
  return formatter.format(date)
}

const isISODateTime = (input: string): boolean => {
  const isoDateTimeRegex: RegExp =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(([+-])(\d{2}):(\d{2})|Z)?$/
  return isoDateTimeRegex.test(input)
}

export const convertToYearIfISODateTime = (input: string, locale: string): string => {
  return isISODateTime(input) ? getYearFromISODateTime(input, locale) : input
}
