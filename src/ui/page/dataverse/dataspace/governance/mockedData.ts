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
  contains: T[]
}
type NonEmptyContainer<T> = {
  contains: NonEmptyArray<T>
}

type ParagraphDTOWithNumber = Omit<DescriptedDTO, 'description'> &
  Numbered & {
    description: string
  }

type DescriptedDTOWithNumber = DescriptedDTO & Numbered

export type ParagraphDTO = ParagraphDTOWithNumber

export type ArticleDTO = DescriptedDTOWithNumber & Container<ParagraphDTO>

export type SubSectionDTO = DescriptedDTOWithNumber & NonEmptyContainer<ArticleDTO>

export type SectionDTO = DescriptedDTOWithNumber & NonEmptyContainer<SubSectionDTO>

type Chapter = DescriptedDTO & NonEmptyContainer<SectionDTO>

export const mockedGovernanceChapter: Chapter = {
  id: '1',
  title: 'Chapter 1',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
  contains: [
    {
      id: '2',
      title: 'Identity Management',
      description:
        'It refers to the processes and tools used to manage and secure the access and use of data within a Data Space.',
      number: '1.1',
      contains: [
        {
          id: '3',
          title: 'Acceptable Forms of Identification',
          number: '1.1.1',
          contains: [
            {
              title: 'Condition: Only Decentralized Identifiers (DID) are accepted',
              id: '4',
              number: '1.1.1.1',
              contains: [
                {
                  id: '5',
                  title: 'Verification method',
                  description: 'Must be ‘KEY”',
                  number: '1.1.1.1.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '6',
      title: 'Governance Model',
      description:
        'It refers to the framework of policies, processes, and procedures that govern the acquisition, management, and use of data within an organization.',
      number: '1.2',
      contains: [
        {
          id: '7',
          title: 'Create rules',
          number: '1.2.1',
          contains: [
            {
              title: 'Governance creation by Specific users',
              id: '8',
              number: '1.2.1.1',
              contains: [
                {
                  id: '9',
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
          id: '10',
          title: 'Edit rules',
          number: '1.2.2',
          contains: [
            {
              title: 'Governance Amendment by Specific users',
              id: '11',
              number: '1.2.2.1',
              contains: [
                {
                  id: '12',
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
          id: '13',
          title: 'Remove rules',
          description:
            'Process of removing or revoking established policies and procedures governing the management and use of data within an Data Space.',
          number: '1.2.3',
          contains: [
            {
              title: 'Governance cancellation by Specific users',
              id: '14',
              description: 'Keys with the permissions to delete rules related to the Data Space.',
              number: '1.2.3.1',
              contains: [
                {
                  id: '15',
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
      id: '16',
      title: 'Datasets Management',
      number: '1.3',
      contains: [
        {
          id: '17',
          title: 'Reference dataset',
          number: '1.3.1',
          contains: [
            {
              title: 'Datasets referencing with specific criteria',
              id: '18',
              number: '1.3.1.1',
              contains: [
                {
                  id: '19',
                  title: 'Topic',
                  description: 'Agriculture or food',
                  number: '1.3.1.1.1'
                },
                {
                  id: '20',
                  title: 'Size',
                  description: 'Smaller than 5 Go',
                  number: '1.3.1.1.2'
                },
                {
                  id: '21',
                  title: 'Geographical Coverage',
                  description: 'Metropolitan France or French Overseas Territories or Europe',
                  number: '1.3.1.1.3'
                },
                {
                  id: '22',
                  title: 'Authorship',
                  description: 'Must be specified',
                  number: '1.3.1.1.4'
                },
                {
                  id: '23',
                  title: 'Metadata',
                  description: 'Must be completed',
                  number: '1.3.1.1.5'
                },
                {
                  id: '24',
                  title: 'Licence',
                  description:
                    'Etalab 2.0, OGL, CC-BY 2.0, ODC-BY or ODbl 1.0, Licence 3, Licence 4, Licence 5, Licence 6, Licence 7, Licence 8, Licence 9, Licence 10, Licence 11, Licence 12 Licence 13, Licence 14, Licence 15, Licence 16, Licence 17',
                  number: '1.3.1.1.7'
                },
                {
                  id: '25',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575656 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575659 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575660 did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575662',
                  number: '1.3.1.1.6'
                }
              ]
            }
          ]
        },
        {
          id: '37',
          title: 'Edit metadata',
          number: '1.3.2',
          contains: [
            {
              title: 'Metadata creation by specific users',
              id: '38',
              number: '1.3.2.1',
              contains: [
                {
                  id: '39',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.2.1.1'
                }
              ]
            },
            {
              title: 'Metadata amendment by specific users',
              id: '41',
              number: '1.3.3.2',
              contains: [
                {
                  id: '42',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.3.2.1'
                }
              ]
            },
            {
              title: 'Metadata cancellation by specific users',
              id: '44',
              number: '1.3.4.3',
              contains: [
                {
                  id: '45',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.4.3.1'
                }
              ]
            }
          ]
        },
        {
          id: '46',
          title: 'Dereference dataset',
          number: '1.3.3',
          contains: [
            {
              title: 'Datasets dereferencing by specific users',
              id: '47',
              number: '1.3.3.1',
              contains: [
                {
                  id: '48',
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
          id: '49',
          title: 'Download dataset',
          number: '1.3.4',
          contains: [
            {
              title: 'Datasets download by specific users',
              id: '50',
              number: '1.3.4.1',
              contains: [
                {
                  id: '51',
                  title: 'Users',
                  description:
                    'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655',
                  number: '1.3.4.1.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '52',
      title: 'Services Management',
      number: '1.4',
      contains: [
        {
          id: '53',
          title: 'Reference service',
          number: '1.4.1',
          contains: [
            {
              title: 'Condition : can reference service.',
              id: '54',
              number: '1.4.1.1',
              contains: [
                {
                  id: '55',
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
          id: '56',
          title: 'Create service metadata',
          number: '1.4.2',
          contains: [
            {
              title: 'Condition : can create metadata.',
              id: '57',
              number: '1.4.2.1',
              contains: [
                {
                  id: '58',
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
          id: '59',
          title: 'Edit service metadata',
          number: '1.4.3',
          contains: [
            {
              title: 'Condition : can edit metadata.',
              id: '60',
              number: '1.4.3.1',
              contains: [
                {
                  id: '61',
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
          id: '62',
          title: 'Remove service metadata',
          number: '1.4.4',
          contains: [
            {
              title: 'Condition: can remove metadata.',
              id: '63',
              number: '1.4.4.1',
              contains: [
                {
                  id: '64',
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
          id: '65',
          title: 'Dereference service',
          number: '1.4.5',
          contains: [
            {
              title: 'Condition: can dereference service.',
              id: '66',
              number: '1.4.5.1',
              contains: [
                {
                  id: '67',
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
      id: '68',
      title: 'Business Model',
      number: '1.5',
      contains: [
        {
          id: '69',
          title: 'Datasets retribution',
          number: '1.5.1',
          contains: [
            {
              title: 'Datasets are not retributed',
              id: '70',
              number: '1.5.1.1',
              contains: []
            }
          ]
        },
        {
          id: '72',
          title: 'Service retribution',
          number: '1.5.2',
          contains: [
            {
              title: 'Services are retributed if',
              id: '73',
              number: '1.5.2.1',
              contains: [
                {
                  id: '74',
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
