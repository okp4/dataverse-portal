export type SparqlResult = {
  results: {
    bindings: SparqlBinding[]
  }
}

type SparqlBindingProperty = {
  type: string
  value: string
}

export type SparqlBinding = {
  id: SparqlBindingProperty
  metadata: SparqlBindingProperty
  type: SparqlBindingProperty
  title: SparqlBindingProperty & {
    'xml:lang': string
  }
  publisher: SparqlBindingProperty
  topic: SparqlBindingProperty
  prefLabel: SparqlBindingProperty & {
    'xml:lang': string
  }
}
