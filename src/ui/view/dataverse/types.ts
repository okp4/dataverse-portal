export type Category = 'generalMetadata' | 'auditMetadata'

export type ItemGeneralMetadata = {
  category: Category
  property: string
  value: string | string[]
}
