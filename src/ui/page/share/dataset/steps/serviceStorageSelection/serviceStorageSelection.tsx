import { useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { useDataverseStore } from '@/ui/store'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import { loadingDataverseCards } from '@/ui/view/loadingDataverseCards/loadingDataverseCards'
import type { DataverseItem } from '@/ui/types'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import '../../../i18n/index'
import './serviceStorageSelection.scss'

// eslint-disable-next-line max-lines-per-function
export const ServiceStorageSelection: FC = () => {
  const { t } = useTranslation(['common', 'share', 'publisher'])
  const currentLng = activeLanguageWithDefault().lng

  const { loadDataverse, dataverse, setByTypeFilter, isLoading, setLanguage } = useDataverseStore(
    state => ({
      loadDataverse: state.loadDataverse,
      dataverse: state.dataverse,
      isLoading: state.isLoading,
      hasNext: state.hasNext,
      setLanguage: state.setLanguage,
      setByTypeFilter: state.setByTypeFilter
    })
  )
  const handleServiceSearch = useCallback((searchTearm: string) => {
    console.log(searchTearm)
  }, [])

  const handleSelect = useCallback(
    (id: string) => () => {
      console.log(id)
    },
    []
  )

  useEffect(() => {
    setLanguage(currentLng)()
    setByTypeFilter('Service')()
    loadDataverse()()
    return () => setByTypeFilter('all')()
  }, [currentLng, loadDataverse, setByTypeFilter, setLanguage])

  return (
    <div className="okp4-dataverse-portal-share-dataset-page-service-selection-container">
      <h2>{t('share:share.dataset.selectStorage')}</h2>
      <div className="okp4-dataverse-portal-share-dataset-page-service-selection-tabs">
        <h3>{t('share:share.dataset.location')}</h3>
        <div>tabs</div>
      </div>
      <SearchBar
        onSearch={handleServiceSearch}
        placeholder={t('share:share.dataset.serviceStorageSearch')}
        value=""
      />
      <div className="okp4-dataverse-portal-share-dataset-page-services-container">
        <div className="okp4-dataverse-portal-share-dataset-page-services">
          {!dataverse()().length && isLoading()()
            ? loadingDataverseCards(12)
            : dataverse()().map(({ id, properties }) => {
                const publisher = properties.find(p => p.property === 'publisher')?.value ?? ''
                const publisherDescription = `${t('metadata:publisher')} **${publisher}**`
                return (
                  <DataverseItemCard
                    button={<Button label={t('select')} onClick={handleSelect(id)} />}
                    key={id}
                    label={properties.find(p => p.property === 'title')?.value ?? ''}
                    topic={publisherDescription}
                    type={
                      properties
                        .find(p => p.property === 'type')
                        ?.value.toLowerCase() as DataverseItem
                    }
                  />
                )
              })}
        </div>
      </div>
    </div>
  )
}
