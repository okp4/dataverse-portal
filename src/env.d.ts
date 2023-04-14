declare const APP_ENV: {
  urls: Record<
    | 'social:twitter'
    | 'social:linkedin'
    | 'social:discord'
    | 'social:medium'
    | 'form:feedback'
    | 'about:okp4',
    string
  >
  sparql: Record<'endpoint' | 'credentials', string>
}
