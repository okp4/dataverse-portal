import { useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { useDataverseStore } from '@/ui/store'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import { loadingDataverseCards } from '@/ui/view/loadingDataverseCards/loadingDataverseCards'
import type { Tab } from '@/ui/view/tabs/tabs'
import { Tabs } from '@/ui/view/tabs/tabs'
import type { DataverseItem } from '@/ui/types'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { LottieLoader } from '@/ui/component/loader/lottieLoader'
import threeDots from '@/ui/asset/loader/threeDots.json'
import '@/ui/page/share/i18n/index'
import './serviceStorageSelection.scss'

// eslint-disable-next-line max-lines-per-function
export const ServiceStorageSelection: FC = () => {
  const { t } = useTranslation(['common', 'share', 'publisher'])
  const [activeTab, setActiveTab] = useState<Tab>('left')
  const currentLng = activeLanguageWithDefault().lng

  const { loadDataverse, dataverse, setByTypeFilter, isLoading, hasNext, setLanguage } =
    useDataverseStore(state => ({
      loadDataverse: state.loadDataverse,
      dataverse: state.dataverse,
      isLoading: state.isLoading,
      hasNext: state.hasNext,
      setLanguage: state.setLanguage,
      setByTypeFilter: state.setByTypeFilter
    }))

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
        <Tabs
          activeTab={activeTab}
          disabledTab="right"
          handleTabChange={setActiveTab}
          leftTabLabel={t('share:share.dataset.local')}
          rightTabLabel={t('share:share.dataset.external')}
        />
      </div>
      <SearchBar
        onSearch={handleServiceSearch}
        placeholder={t('share:share.dataset.serviceStorageSearch')}
        value=""
      />
      <div
        className="okp4-dataverse-portal-share-dataset-page-services-container"
        id="scrollable-container"
      >
        <InfiniteScroll
          dataLength={dataverse()().length}
          hasMore={hasNext()()}
          loader={dataverse()().length && <LottieLoader animationData={threeDots} />}
          next={loadDataverse()}
          scrollThreshold={0.91}
          scrollableTarget="scrollable-container"
        >
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
        </InfiniteScroll>
      </div>
    </div>
  )
}