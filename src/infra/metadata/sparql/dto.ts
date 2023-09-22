type DataType = {
  dataType: string
}
type WithLanguage = {
  'xml:lang': string
}

type SparqlBindingVars = {
  vars: string[]
}
type SparqlBindingProperty = {
  type: 'uri' | 'literal'
  value: string
}

export type SparqlBindingValue =
  | SparqlBindingProperty
  | (SparqlBindingProperty & WithLanguage)
  | (SparqlBindingProperty & DataType)

type SparqlBinding = {
  title: SparqlBindingProperty & WithLanguage
  description: SparqlBindingProperty & WithLanguage
  publisher: SparqlBindingProperty
  tags: SparqlBindingProperty
  temporalCoverage: SparqlBindingProperty
  createdBy: SparqlBindingProperty
  lastModifiedBy: SparqlBindingProperty
  updatedOn: SparqlBindingProperty & DataType
  createdOn: SparqlBindingProperty & DataType
  category?: SparqlBindingProperty
  creator?: SparqlBindingProperty
  format?: SparqlBindingProperty
  image?: SparqlBindingProperty
  license?: SparqlBindingProperty
  spatialCoverage?: SparqlBindingProperty
  topic?: SparqlBindingProperty
}

export type SparqlResult = {
  results: {
    head: SparqlBindingVars
    bindings: SparqlBinding[]
  }
}
