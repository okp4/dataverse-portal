type ID = {
  id: string
}

type DescribableDTO = {
  title: string
  description?: string
}

type DescriptedDTO = ID & DescribableDTO

type Numbered = {
  number: string
}

type ParagraphDTOWithNumber = Omit<DescriptedDTO, 'description'> &
  Numbered & {
    description: string
  }

type DescriptedDTOWithNumber = DescriptedDTO & Numbered

type Container<T> = {
  contains: T[]
}

export type ParagraphDTO = ParagraphDTOWithNumber

export type ArticleDTO = DescriptedDTOWithNumber & Container<ParagraphDTO>

export type SubSectionDTO = DescriptedDTOWithNumber & Container<ArticleDTO>

type SectionDTO = DescriptedDTOWithNumber & Container<SubSectionDTO>

export type Chapter = DescriptedDTO & Container<SectionDTO>
