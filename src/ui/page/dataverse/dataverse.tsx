import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { useAppStore } from '@/ui/store/appStore'
import { useDataverseStore } from '@/ui/store/index'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import Chip from '@/ui/component/chip/chip'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import {
  SelectionFilter,
  FilterLabel
} from '@/ui/view/dataverse/component/filters/selectionFilter/selectionFilter'
import '@/ui/view/dataverse/component/filters/i18n/index'
import './dataverse.scss'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { LottieLoader } from '@/ui/component/loader/lottieLoader'
import threeDots from '@/ui/asset/loader/threeDots.json'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import { loadingDataverseCards } from '@/ui/view/loadingDataverseCards/loadingDataverseCards'
import type { ByTypeFilterInput, DataverseElementType } from '@/domain/dataverse/command'
import { pipe } from 'fp-ts/lib/function'
import { useNavigate } from 'react-router-dom'

type DataverseItemType = 'service' | 'zone' | 'dataset'
type FilterLabel = 'zones' | 'datasets' | 'services' | 'all'

type DataverseItem = {
  id: string
  label: string
  description: string
}

export type InternationalizedDescription = {
  [lang in 'en' | 'fr' | 'de']: string
}

export type Governance = {
  description: InternationalizedDescription
}

type Typed<T extends DataverseItemType> = { type: T }

type ZoneResource = {
  type: Exclude<DataverseItemType, 'zone'>
  amount: number
  lastUpdated: string
}

export type Service = DataverseItem & Typed<'service'>

export type Dataset = DataverseItem & Typed<'dataset'>

export type Zone = DataverseItem &
  Typed<'zone'> & {
    governance: Governance
    resources: ZoneResource[]
  }

export type DataverseItemDetails = Zone | Dataset | Service

type Filter = {
  label: FilterLabel
  value: ByTypeFilterInput
  icon: string
}

const dataverseFilters: Filter[] = [
  {
    label: 'all',
    value: 'all',
    icon: 'all'
  },
  {
    label: 'zones',
    value: 'Zone',
    icon: 'dataspace-created'
  },
  {
    label: 'datasets',
    value: 'Dataset',
    icon: 'dataset-folder'
  },
  {
    label: 'services',
    value: 'Service',
    icon: 'service-folder'
  }
]

export const dataverseItems: DataverseItemDetails[] = [
  {
    id: 'ef347285-e52a-430d-9679-dcb76b962ce7',
    type: 'zone',
    label: 'Rhizome',
    description:
      'Rhizome is a data space operated by OKP4, currently under development based on OKP4 technology. Rhizome demonstrates the power of data processing and sharing, and the value we can achieve by effectively connecting different sources of open access agricultural data in different data formats. Rhizome aims to connect as much data as possible and provide valuable visuals and metrics in various agriculture-related areas, such as land use and land management, crop and livestock management, and forest resources and timber industry.',
    governance: {
      description: {
        en: 'This first Data Space has a centralized governance: only OKP4 can modify the rules. In this first version, only OKP4 can register data and services. However, any wallet is allowed to download data.',
        fr: "Ce premier Data Space a une gouvernance centralisée : seul OKP4 peut modifier les règles. Dans cette première version, seul OKP4 peut enregistrer des données et des services. Toutefois, n'importe quel wallet est autorisé à télécharger les données.",
        de: 'Dieser erste Data Space hat eine zentralisierte Governance: Nur OKP4 kann die Regeln ändern. In dieser ersten Version kann nur OKP4 Daten und Dienste speichern. Allerdings ist es jeder Wallet erlaubt, Daten hochzuladen.'
      }
    },
    resources: [
      {
        type: 'dataset',
        amount: 20,
        lastUpdated: '2023-03-28T00:00:00+00:00'
      },
      {
        type: 'service',
        amount: 7,
        lastUpdated: '2023-03-31T00:00:00+00:00'
      }
    ]
  },
  {
    id: '97ff7e16-c08d-47be-8475-211016c82e33',
    type: 'zone',
    label: 'DS4I',
    description:
      "Data Space for Investors (DS4I) is a private Data Space created and maintained by OKP4 Team. DS4I's purpose is to present a simple and user-friendly Proof of Concept to demonstrate for potential investors how OKP4 protocol works based on simple governance rules.",
    governance: {
      description: {
        en: 'DS4I is a private Data Space where resources are only accessible for a group of addresses contained in a dedicated whitelist. Only OKP4 have the authority to edit the Whitelist.',
        fr: "DS4I est un Data Space privé où les ressources ne sont accessibles que pour un groupe d'adresses de wallets contenues dans une Whitelist dédiée. Seul OKP4 a le droit de modifier cette whitelist.",
        de: 'DS4I ist ein privater Data Space, in dem die Ressourcen nur für eine Gruppe zugänglich sind. Adressen von Wallets, die in einer dedizierten Whitelist enthalten sind. Nur OKP4 hat das Recht, diese Whitelist zu ändern.'
      }
    },
    resources: [
      {
        type: 'dataset',
        amount: 1,
        lastUpdated: '2023-03-25T00:00:00+00:00'
      },
      {
        type: 'service',
        amount: 1,
        lastUpdated: '2023-04-02T00:00:00+00:00'
      }
    ]
  },
  {
    id: '79ec2986-0d71-4e92-a48d-95379b3da9ed',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '7ff3d2a4-e6b2-4b06-8619-4fc8740dad86',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 CITY',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '142dacec-eb0f-4cd3-ab2b-d2095b8552b3',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '5a5def4d-8328-4830-b71e-b19d9e2394bc',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 REGION',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '957df710-4e35-45fb-add8-34d49904a77a',
    type: 'dataset',
    label: 'AGRESTE 2020',
    description:
      'Annual agricultural statistics, consisting of the areas, yields and production of the French territory.'
  },
  {
    id: 'd23f0f6c-780d-4897-ba91-111d519b6f56',
    type: 'dataset',
    label: 'BASE SIRENE - NAF',
    description:
      'This dataset is obtained using the join between the SIRENE database and the NAF code reference table to obtain information on the activity of establishments.'
  },
  {
    id: 'e3fb5ffc-31fd-45e5-a60b-1bf1c3e317e5',
    type: 'dataset',
    label: 'BD Forest',
    description:
      'The BD Forêt® version 1 presents the land cover (by describing the structure and dominant composition of the wooded or natural formations) based on a departmental nomenclature that varies from about fifteen to sixty items depending on the forest diversity of the department being mapped. Until 2006, the nomenclature was based on departmental areas and is available for the entire territory of Metropolitan France. For more than half of the departments, several versions of the BD Forêt® version 1 are available. The BD Forêt® version 2 was produced between 2007 and 2018 by photo-interpretation of colour infrared images from the BD ORTHO®. It assigns to each mapped area of more than 5000 m² a type of vegetation formation.'
  },
  {
    id: '5aeba752-dfb2-48c1-a90d-c0edd0738c0d',
    type: 'dataset',
    label: 'BD TOPO departments',
    description:
      'The BD TOPO® is a 3D vector description (structured in objects) of the elements of the territory and its infrastructures, with metric precision, usable at scales ranging from 1 : 2 000 to 1 : 50 000. It covers in a coherent way all the geographical and administrative entities of the national territory. It allows visualisation, positioning and simulation for analysis and operational management of the territory. The description of geographical objects in 3D allows for realistic representation of spatial analyses useful for decision-making processes in the context of various studies. Since 2019, a new (updated) edition is published every quarter.'
  },
  {
    id: '2c039dd5-6cc6-41bb-88eb-ab39e9f2ea81',
    type: 'dataset',
    label:
      'Crop and crop group reference table of the Graphic Parcel Register (Registre Parcellaire Graphique)',
    description:
      'Table specific to the distribution of the Graphic Parcel Register (Registre Parcellaire Graphique)): The notion of crop group in this table does not correspond to the notion of crop group of the CAP regulation nor to that of the ISIS reference systems. In this table, each crop code is explained by a label and linked to a crop group code and its label.'
  },
  {
    id: '96a562a9-5feb-4a41-bcf2-cc8610af9f78',
    type: 'dataset',
    label: 'Data Total Child Nutrition Study',
    description:
      'Total Diet Studies (TDS) are national surveys that aim to estimate the chronic dietary exposure of a population to chemical compounds. They are based on the analysis of a large number of substances in food samples representative of the diet of the population studied. From 2012 to 2016, the Anses conducted the Total Infant Feeding Study (EATi), one of the first studies at international level to estimate the dietary exposure of non-breastfed children under 3 years of age. It involved the analysis of 670 substances (environmental contaminants, minerals, phytopharmaceutical products, etc.) in the diet of non-breastfed children living in metropolitan France.'
  },
  {
    id: '49c66bf2-8cda-4b87-9430-ad4a65ff5793',
    type: 'dataset',
    label: 'Database on Forest Fires in France (BDIFF)',
    description:
      'The forest fire database (BDIFF) is an internet application in charge of centralising data on forest fires on French territory since 2006 and making all this information available to the public and the State services. The application distributed on the portal allows any interested user to consult national data on forest fires up to the year before the current year, aggregated at the commune level.'
  },
  {
    id: '552382cb-9043-455d-b155-fc738930fe28',
    type: 'dataset',
    label: 'Delimitation of the geographical areas of the SIQO',
    description:
      'According to the European regulations 1151/2012 of 21 November 2012 and 1308/2013 of 17 December 2013, the specification of the designations defines the geographical area of the products registered as PDO or PGI. In the case of an appellation, the geographical area or production area is the territory in which all the stages of production of the product must be carried out in compliance with the practices and production conditions defined by the specification in order to be able to claim the SIQO. The production area of the designation must cover the production area of the raw material (which generally corresponds to the delimited or identified area) and the processing area.'
  },
  {
    id: '5da01b5b-af91-4ecd-9458-c885a248417e',
    type: 'dataset',
    label: 'Detailed history of areas, livestock and number of operators by department',
    description:
      'The areas and livestock are attached to the department of the site of activity or, failing that, of the headquarters of the holding.'
  },
  {
    id: 'c0cc2228-c88b-40a9-9afd-fe0204774abe',
    type: 'dataset',
    label: 'Directory of High Environmental Value farms',
    description:
      'The High Environmental Value (HVE) is the third and highest level of environmental certification for farms. Since February 2012, when the scheme was implemented, the number of certified farms has grown steadily. Nearly 29,900 farms (29,898 to be precise - figure as of 1 July 2022) can claim to be High Environmental Value, proof of their commitment to practices that respect the environment and biodiversity.'
  },
  {
    id: '6be4c7c2-c749-40dc-ac27-2653fa591356',
    type: 'dataset',
    label: 'FRANCE : REGION - DEPARTMENT - CITY',
    description:
      'This dataset is obtained by joining 3 ADMIN EXPRESS datasets containing the different layers of the French territory: Region, Department and City.'
  },
  {
    id: 'aec18920-43ca-464e-bea9-1a642ba56dda',
    type: 'dataset',
    label: 'Fisheries control statistics',
    description:
      'With the aim of protecting fisheries resources, marine biodiversity and fishing-related economic activity in the long term, the state-owned startup MonitorFish & MonitorEnv is developing tools to improve the targeting and monitoring of fisheries and marine environmental controls.'
  },
  {
    id: '1a4c5896-b13e-40f7-a603-5a5b3ed996a1',
    type: 'dataset',
    label: 'Geographical area of PGIs',
    description:
      'Geographical area of protected geographical indications (PGI). The file lists for each commune, identified by its department, name and INSEE code, the geographical areas of the PGIs present in the commune.'
  },
  {
    id: '3ed871dc-72d0-499f-b8c2-7edcad56a76e',
    type: 'dataset',
    label: 'Geographical areas of PDO/CDO',
    description:
      'Geographical areas of the controlled appellations of origin (AOC)/protected appellations of origin (AOP). The file lists for each commune, identified by its department, its name and its INSEE code, the geographical areas of the AOC/AOP appellations which are located in the commune.'
  },
  {
    id: '965dae6f-19ad-4a2b-93f3-05e2d09d7496',
    type: 'dataset',
    label: 'List of forest areas classified as protection forests',
    description:
      'List of classified forests under a protection regime: departmental data, names, areas and status (public, private).'
  },
  {
    id: '6377fcb1-21a1-4f28-bebc-20f065c3000a',
    type: 'dataset',
    label: 'List of regulated forest species',
    description:
      'Reference list of species that can be harvested in France for the production of forestry materials (seeds and seedlings)'
  },
  {
    id: '9cda6da3-c587-41d1-96a1-7435f90d7492',
    type: 'dataset',
    label: 'Monthly soil moisture index data for the uniform SWI natural disaster scheme',
    description:
      "The SWI (Soil Wetness Index) is a soil moisture index documented in the scientific literature. It represents, over a depth of about two metres, the state of the soil's water reserve in relation to the useful reserve (water available for plant nutrition)."
  },
  {
    id: '0ea1fc7a-dd97-4adc-a10e-169c6597bcde',
    type: 'dataset',
    label: 'Nutritional composition table for Ciqual 2020 foods',
    description:
      'With 3,185 foods referenced, this new version of the Ciqual table includes details of all individual sugars contained in foods. It also provides updated data on the main fruits and vegetables, including those grown in the French overseas territories. To keep up with the new eating habits of the French, the table now includes around fifty new foods adapted to vegetarian diets.'
  },
  {
    id: '10ca8ff2-f0c3-47ba-b37a-8560b2e41ae7',
    type: 'dataset',
    label: 'OCS GE',
    description:
      'The OCS GE is a reference database for the description of the land use of the entire metropolitan territory and the overseas departments and regions (DROM). It is produced from existing data extracted from IGN databases, and from any other data that can be mobilised from national or local reference systems. More recently, in the context of the land artificialisation system, it is also produced using new artificial intelligence processes.'
  },
  {
    id: '8ad881d8-f350-4cc0-bab3-8e694aa63cd3',
    type: 'dataset',
    label: 'Organic Agriculture (OA) plots declared for the 2020 CAP',
    description:
      'The data disseminated correspond to the plots of land declared as organic and in conversion when applying for Common Agricultural Policy (CAP) aid for the 2020 campaign - in their known situation, as determined by the administration at the end of the investigation, after 30 June of year N+1. These data include 80 to 85% of the total number of parcels under organic production, as not all parcels under organic production are subject to a CAP aid application.'
  },
  {
    id: '5626b242-0c02-45a7-98ca-34c9f4d42b04',
    type: 'dataset',
    label: 'Plot delimitation of the AOC wine-growing areas of the INAO',
    description:
      'The delimited parcel area corresponds to a delimitation based on the administrative limits of the land register (the parcels) and whose sufficiently fine mesh makes it possible to take account of very localised variations in the physical environment. This delimitation is mainly used for PDO and PGI wines and corresponds in this case to the production area of the raw material.'
  },
  {
    id: 'f047abf0-cbad-49d7-985e-7171b9b0e619',
    type: 'dataset',
    label: 'Plots in Organic Agriculture (AB) declared to the CAP 2021',
    description:
      'The data disseminated correspond to the plots declared as organic and in conversion when applying for Common Agricultural Policy (CAP) aid for the 2019 campaign - in their known situation, as determined by the administration at the end of the investigation, after 30 June of the year N+1. These data include 80 to 85% of the total number of parcels under organic production, as not all parcels under organic production are subject to a CAP aid application.'
  },
  {
    id: '441bb5ec-6c00-428f-938f-720e5e918a50',
    type: 'dataset',
    label: 'Plots in Organic Agriculture (AB) declared to the CAP 2021',
    description:
      'The data disseminated correspond to the plots of land declared as organic and in conversion when applying for Common Agricultural Policy (CAP) aid for the 2021 campaign - in their known situation, as determined by the administration at the end of the investigation, after 30 June of year N+1. These data include 80 to 85% of the total number of parcels under organic production, as not all parcels under organic production are subject to a CAP aid application.'
  },
  {
    id: 'ca752b42-9740-4436-a86f-cd3c5e084d33',
    type: 'dataset',
    label: 'RPG AGRESTE 2020',
    description:
      'Data set resulting from the join between RPG and AGRESTE data. Obtained through a sequence of data processing using the OKP4 protocol.'
  },
  {
    id: '3545ec2f-13cd-4909-a52f-df938e8c7a61',
    type: 'dataset',
    label: 'RPG FRANCE 2020',
    description:
      'The graphical parcel register is a geographic database used as a reference for the instruction of Common Agricultural Policy (CAP) subsidies. The anonymized version distributed here as part of the public service for making reference data available contains the graphic data of parcels (since 2015) with their main crop. These data are produced by the Agency of Services and Payment (ASP) since 2007'
  },
  {
    id: '46f75dd8-0b13-4762-bde3-bf31f85810f6',
    type: 'dataset',
    label: 'Reference doses for the plant protection treatment frequency indicator',
    description:
      'The Phytosanitary Treatment Frequency Indicator (TFI) is an indicator for monitoring the use of phytopharmaceutical products at the farm or group of farms level. The IFT is expressed as the number of reference doses per hectare applied on a spatial unit during a given period. Most commonly, the spatial unit is the plot and the period is the crop year. More information on http://agriculture.gouv.fr/indicateur-de-frequence-de-traitements-phytosanitaires-ift'
  },
  {
    id: 'd22f0f6c-669d-4837-ba91-111d519b6f56',
    type: 'dataset',
    label: 'Reference table of NAF Rev2 codes',
    description:
      'The French Nomenclature of Activities (NAF) is a nomenclature of productive economic activities, mainly developed to facilitate the organization of economic and social information.'
  },
  {
    id: '65eda3f4-ecb6-4322-90e7-1832ed3178e9',
    type: 'dataset',
    label: 'SIRENE BASE - ESTABLISHMENT STOCK - OCTOBER 2022',
    description: 'All active and closed establishments in their current directory status.'
  },
  {
    id: 'd41e0628-e77a-446f-a3f9-624d5b061762',
    type: 'dataset',
    label: 'SIRENE database - agriculture, forestry and fishing',
    description:
      'This dataset refers to all the agricultural, forestry and fishing companies in France in activity. Obtained through a sequence of data processing using the OKP4 protocol.'
  },
  {
    id: '55421f8d-b36a-48a4-961a-dc18ed5088b5',
    type: 'dataset',
    label: 'Surface area, livestock and number of organic operators in the municipality',
    description:
      'These data on the number of operators, areas and livestock come from the annual controls that the approved certification bodies carry out on farms and processing and distribution companies committed to organic production. The data are aggregated at the communal level: insee code of the commune of the site of activity or, failing that, of the head office of the farm.'
  },
  {
    id: '1ef341e8-de34-4561-95b6-29c834901c1f',
    type: 'dataset',
    label: 'contour lines',
    description:
      "The contour lines product is a vector version of the altimetric contour lines (also called 'isohypses') present in the IGN's cartographic products. Calculated from the RGE ALTI® data, they allow the relief to be understood in a way that complements the classic digital terrain models (DTMs) and facilitates overlaying with business data for cartographic use."
  },
  {
    id: '16c4cd10-521a-4829-b1bd-a1e2ac60459a',
    type: 'service',
    label: 'Data Connector',
    description:
      'This service allows you to inject data files into OpenSearch so that you can consume the knowledge created through visualization.'
  },
  {
    id: '987e1ffd-05e7-48e4-a429-1172689477ee',
    type: 'service',
    label: 'Data Grouping',
    description: 'The Data Grouping tool allows you to organize identical data into groups.'
  },
  {
    id: 'e4fa9cb1-59f8-4f40-9ba3-f00f8a18e3de',
    type: 'service',
    label: 'Data Join Geospatial',
    description: 'The Data Join Geospatial tool allows to join two georeferenced datasets.'
  },
  {
    id: '6636b94a-b2f7-4139-9227-6838de9d3ef3',
    type: 'service',
    label: 'Data Join Tabular',
    description:
      'The Data Join Tabular tool allows you to join two datasets containing common values to provide new information.'
  },
  {
    id: '6272c8d0-f5ed-4394-8f54-a7b429faec13',
    type: 'service',
    label: 'Data Refactor',
    description:
      'The Data Refactor tool allows you to edit and modify a data set in order to standardize it.'
  },
  {
    id: 'fbe11a63-85da-4f82-97c4-f719ac1f4ce8',
    type: 'service',
    label: 'Data Selector',
    description:
      'The Data Selector tool allows you to select a sample of the data set, specifying a number of rows. It is possible to delete or keep columns. Another parameter allows you to select data from a column according to its value(s).'
  },
  {
    id: 'd1b0b4d3-f9a6-4115-bcd8-ad97233a7b08',
    type: 'service',
    label: 'Storage',
    description: 'Data storage service'
  }
]

const selectionFilters = {
  'data-spaces': ['Rhizome', 'DS4I', 'Data space 3', 'Data space 4'],
  topics: ['Agriculture environment and forestry', 'Marketing and customer behaviour'],
  services: [
    'Data cleaning',
    'Computer vision',
    'Machine learning',
    'Data mining',
    'Data visualization',
    'Data analysis',
    'Data management'
  ],
  'data-geo-cov': [
    'Afghanistan',
    'France',
    'Spain',
    'Germany',
    'Albania',
    'Algeria',
    'Antigua-and-barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Bahamas'
  ],
  'data-format': ['CSV', 'JSON', 'XML'],
  'data-licence': ['ETALAB', 'LO-FR-2_0', 'Licence 3']
}

export const getResourceDetails = (id: string): O.Option<DataverseItemDetails> =>
  pipe(
    dataverseItems,
    A.findFirst(item => item.id === id)
  )

const renderMobileTitleFilters = (label: string, toggleMobileFilters: () => void): JSX.Element => (
  <div className="okp4-dataverse-portal-dataverse-page-filters-mobile">
    <div
      className="okp4-dataverse-portal-dataverse-page-filters-previous-icon"
      onClick={toggleMobileFilters}
    >
      <Icon name="arrow-left" />
    </div>
    <h2>{label}</h2>
  </div>
)

// eslint-disable-next-line max-lines-per-function
const Dataverse = (): JSX.Element => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  const theme = useAppStore(state => state.theme)
  const {
    loadDataverse,
    dataverse,
    setByTypeFilter,
    isLoading,
    hasNext,
    byTypeFilter,
    setLanguage,
    error
  } = useDataverseStore(state => ({
    loadDataverse: state.loadDataverse,
    dataverse: state.dataverse,
    isLoading: state.isLoading,
    hasNext: state.hasNext,
    setLanguage: state.setLanguage,
    setByTypeFilter: state.setByTypeFilter,
    byTypeFilter: state.byTypeFilter,
    error: state.error
  }))

  const { isDesktop, isLargeDesktop } = useBreakpoint()
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const currentLng = activeLanguageWithDefault().lng
  const dispatchNotification = useDispatchNotification()

  const isLargeScreen = isDesktop || isLargeDesktop
  const filtersLabel = t('filters')

  const toggleFilter = useCallback(
    (filter: ByTypeFilterInput) => () => {
      setByTypeFilter(filter)()
      loadDataverse()()
    },
    [loadDataverse, setByTypeFilter]
  )

  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters(!showMobileFilters)
  }, [showMobileFilters])

  const handleDataverseError = useCallback(() => {
    dispatchNotification({
      type: 'error',
      titleKey: 'error.problem',
      messageKey: 'error.processing',
      action: 'refresh'
    })
  }, [dispatchNotification])

  const handleDataverseItemDetails = useCallback(
    (id: string, type: DataverseItemType) => (): void => {
      navigate(`/dataverse/${type}/${id}`)
    },
    [navigate]
  )

  const FiltersChips = (): JSX.Element =>
    useMemo(
      () => (
        <div className="okp4-dataverse-portal-dataverse-page-filters">
          {!isLargeScreen ? (
            renderMobileTitleFilters(filtersLabel, toggleMobileFilters)
          ) : (
            <h2>{filtersLabel}</h2>
          )}
          <FilterLabel label={t('resources.label')} />
          <div className="okp4-dataverse-portal-dataverse-page-filters-chips">
            {dataverseFilters.map(filter => (
              <Chip
                className={`okp4-dataverse-portal-dataverse-page-filter ${filter.label}`}
                icon={<Icon name={`${filter.icon}-${theme}` as IconName} />}
                isSelected={
                  byTypeFilter()() === filter.value ||
                  byTypeFilter()().includes(filter.value as DataverseElementType)
                }
                key={filter.label}
                label={t(`resources.${filter.label}`)}
                onClick={toggleFilter(filter.value)}
              />
            ))}
          </div>
        </div>
      ),
      []
    )
  useEffect(() => {
    O.map(handleDataverseError)(error()())
  }, [error, handleDataverseError])

  useEffect(() => {
    setLanguage(currentLng)()
    loadDataverse()()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLng])

  useEffect(() => {
    !isLargeScreen && setShowMobileFilters(false)
  }, [isLargeScreen])

  useEffect(() => setByTypeFilter('all'), [setByTypeFilter])

  return (
    <div className="okp4-dataverse-portal-dataverse-page-main">
      {(isLargeScreen || showMobileFilters) && (
        <div className="okp4-dataverse-portal-dataverse-page-filters-container">
          <FiltersChips />
          {Object.entries(selectionFilters).map(([filterName, filterValues]) => (
            <SelectionFilter
              filterName={t(`filters:${filterName}.name`)}
              filterValues={filterValues}
              key={filterName}
              searchPlaceholder={t(`filters:${filterName}.search`)}
              selectionType="checkbox"
            />
          ))}
        </div>
      )}
      {(isLargeScreen || !showMobileFilters) && (
        <div className="okp4-dataverse-portal-dataverse-page-catalog">
          <h2>{t('actions.explore')}</h2>
          {!isLargeScreen && (
            <Button
              className="okp4-dataverse-portal-dataverse-page-filters-button"
              label={t('filters')}
              onClick={toggleMobileFilters}
              size="large"
              variant="primary"
            />
          )}
          <InfiniteScroll
            dataLength={dataverse()().length}
            hasMore={hasNext()()}
            loader={
              !showMobileFilters &&
              dataverse()().length && <LottieLoader animationData={threeDots} />
            }
            next={loadDataverse()}
            scrollThreshold={0.91}
            scrollableTarget="page-wrapper"
          >
            <div className="okp4-dataverse-portal-dataverse-page-cards-container">
              {!dataverse()().length && isLoading()()
                ? loadingDataverseCards(12)
                : dataverse()().map(({ id, properties }) => {
                    const type = properties
                      .find(p => p.property === 'type')
                      ?.value.toLowerCase() as DataverseItemType
                    return (
                      <DataverseItemCard
                        button={
                          <Button
                            label={t('actions.details')}
                            onClick={handleDataverseItemDetails(id, type)}
                          />
                        }
                        key={id}
                        label={properties.find(p => p.property === 'title')?.value ?? ''}
                        topic={properties.find(p => p.property === 'topic')?.value ?? ''}
                        type={type}
                      />
                    )
                  })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
}

export default Dataverse
