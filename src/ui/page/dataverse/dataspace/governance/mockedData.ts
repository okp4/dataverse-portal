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

type NonEmptyArray<T> = [T, ...T[]]

type Container<T> = {
  contains: NonEmptyArray<T>
}

type ParagraphDTOWithNumber = Omit<DescriptedDTO, 'description'> &
  Numbered & {
    description: string
  }

type DescriptedDTOWithNumber = DescriptedDTO & Numbered

type ParagraphDTO = ParagraphDTOWithNumber

type ArticleDTO = DescriptedDTOWithNumber & Container<ParagraphDTO>

export type SubSectionDTO = DescriptedDTOWithNumber & Container<ArticleDTO>

export type SectionDTO = DescriptedDTOWithNumber & Container<SubSectionDTO>

type Chapter = DescriptedDTO & Container<SectionDTO>

export const mockedGovernanceChapter: Chapter = {
  id: 'chapter1',
  title: 'Chapter 1',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
  contains: [
    {
      id: 'section1',
      title: 'Identity Management',
      description:
        'It refers to the processes and tools used to manage and secure the access and use of data within an Data Space.',
      number: '1.1',
      contains: [
        {
          id: 'subsection1',
          title: 'Subsection title',
          number: '1.1.1',
          contains: [
            {
              title: 'Condition: Only Decentralized Identifiers (DID) are accepted',
              id: 'article1',
              number: '1.1.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Verification method',
                  description: "Must be 'KEY'",
                  number: '1.1.1.1.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'section2',
      title: 'Governance Model',
      description:
        'It refers to the framework of policies, processes, and procedures that govern the acquisition, management, and use of data within an organization.',
      number: '1.2',
      contains: [
        {
          id: 'subsection1',
          title: 'Create the rules',
          number: '1.2.1',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              number: '1.2.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.2.1.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection2',
          title: 'Update the rules',
          number: '1.2.2',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              number: '1.2.2.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.2.2.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection3',
          title: 'Delete the rules',
          description:
            'Process of removing or revoking established policies and procedures governing the management and use of data within an Data Space.',
          number: '1.2.3',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              description: 'Keys with the permissions to delete rules related to the Data Space.',
              number: '1.2.3.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.2.3.1.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'section3',
      title: 'Datasets Management',
      description:
        'The management of datasets in a Data Space refers to the process of reference, modify metadatas, dereference, and download datasets.',
      number: '1.3',
      contains: [
        {
          id: 'subsection1',
          title: 'Reference dataset',
          description:
            'Make the dataset enable in the dataverse so that it can be seen and used by users in a Data Space.',
          number: '1.3.1',
          contains: [
            {
              title: 'Condition: Title',
              description: 'Keys with the permissions to delete rules related to the Data Space.',
              id: 'article1',
              number: '1.3.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Topic',
                  description: 'Agriculture or food',
                  number: '1.3.1.1.1'
                },
                {
                  id: 'paragraph2',
                  title: 'Size',
                  description: 'Smaller than 5 Go',
                  number: '1.3.1.1.2'
                },
                {
                  id: 'paragraph3',
                  title: 'Geographical Coverage',
                  description: 'Metropolitan France or French Overseas Territories or Europe',
                  number: '1.3.1.1.3'
                },
                {
                  id: 'paragraph4',
                  title: 'Authorship',
                  description: 'Must be specified',
                  number: '1.3.1.1.4'
                },
                {
                  id: 'paragraph5',
                  title: 'Metadata',
                  description: 'Must be completed',
                  number: '1.3.1.1.5'
                },
                {
                  id: 'paragraph6',
                  title: 'Licence',
                  description:
                    'Etalab 2.0, OGL, CC-BY 2.0, ODC-BY or ODbl 1.0, Licence 3, Licence 4, Licence 5, Licence 6, Licence 7, Licence 8, Licence 9, Licence 10, Licence 11, Licence 12 Licence 13, Licence 14, Licence 15, Licence 16, Licence 17',
                  number: '1.3.1.1.7'
                },
                {
                  id: 'paragraph7',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.1.1.6'
                }
              ]
            },
            {
              title: 'To do',
              id: 'article2',
              number: '1.3.1.2',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.2.1'
                },
                {
                  id: 'paragraph2',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.2.2'
                },
                {
                  id: 'paragraph3',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.2.3'
                },
                {
                  id: 'paragraph4',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.2.4'
                }
              ]
            },
            {
              title: 'To do',
              id: 'article3',
              number: '1.3.1.3',
              contains: [
                {
                  id: 'paragraph2',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.2.2'
                }
              ]
            },
            {
              title: 'To do',
              id: 'article1',
              number: '1.3.1.4',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.4.1'
                },
                {
                  id: 'paragraph2',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.4.2'
                },
                {
                  id: 'paragraph3',
                  title: 'To do',
                  description: 'To do',
                  number: '1.3.1.4.3'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection2',
          title: 'Create metadata',
          number: '1.3.2',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              number: '1.3.2.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.2.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection3',
          title: 'Update metadata',
          number: '1.3.3',
          contains: [
            {
              title: 'Condition: Title',
              description:
                'Keys with the permissions to update metadatas of datasets belonging to the Data Space.',
              id: 'article1',
              number: '1.3.3.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.3.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection4',
          title: 'Delete metadata',
          number: '1.3.4',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              number: '1.3.4.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.4.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection5',
          title: 'Dereference metadata',
          number: '1.3.5',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              number: '1.3.5.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.5.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection6',
          title: 'Download metadata',
          number: '1.3.6',
          contains: [
            {
              title: 'Condition: Title',
              id: 'article1',
              number: '1.3.6.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.6.1.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'section4',
      title: 'Services Management',
      number: '1.4',
      contains: [
        {
          id: 'subsection1',
          title: 'Reference dataset',
          number: '1.4.1',
          contains: [
            {
              title: 'Condition : can reference service.',
              id: 'article1',
              number: '1.4.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.4.1.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection2',
          title: 'Create metadata',
          number: '1.4.2',
          contains: [
            {
              title: 'Condition : can create metadata.',
              id: 'article1',
              number: '1.4.2.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.4.2.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection3',
          title: 'Update metadata',
          number: '1.4.3',
          contains: [
            {
              title: 'Condition : can update metadata.',
              id: 'article1',
              number: '1.4.3.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.4.3.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection4',
          title: 'Delete metadata',
          number: '1.4.4',
          contains: [
            {
              title: 'Condition: can delete metadata.',
              id: 'article1',
              number: '1.4.4.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.4.4.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection5',
          title: 'Dereference dataset',
          number: '1.4.5',
          contains: [
            {
              title: 'Condition: can dereference service.',
              id: 'article1',
              number: '1.4.5.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.4.5.1.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'section5',
      title: 'Business Model',
      number: '1.5',
      contains: [
        {
          id: 'subsection1',
          title: 'Dataset retribution',
          number: '1.5.1',
          contains: [
            {
              title: 'Datasets are retributed if',
              id: 'article1',
              number: '1.5.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Retribution',
                  description: 'Datasets are not retributed.',
                  number: '1.5.1.1.1'
                }
              ]
            }
          ]
        },
        {
          id: 'subsection2',
          title: 'Service retribution',
          number: '1.5.2',
          contains: [
            {
              title: 'Services are retributed if',
              id: 'article1',
              number: '1.5.2.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Pricing',
                  description: 'Must be fixed',
                  number: '1.5.2.1.1'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
