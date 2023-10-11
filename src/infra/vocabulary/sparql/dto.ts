export type SparqlResult = {
  results: {
    bindings: SparqlBinding[]
  }
}

type SparqlBindingProperty = {
  type: 'uri' | 'literal'
  value: string
}

export type SparqlBinding = {
  term: SparqlBindingProperty
  prefLabel: SparqlBindingProperty & {
    'xml:lang': string
  }
}
