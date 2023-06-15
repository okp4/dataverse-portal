import { useRef, useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import classNames from 'classnames'
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
import { isService, serviceGeneralMetadata } from '@/ui/page/dataverse/service/service'
import { DetailedDataverseItem } from '@/ui/view/dataverse/component/dataverseItemDetails/detailedDataverseItem'
import { dataverseItems } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import '@/ui/page/share/i18n/index'
import './serviceStorageSelection.scss'

export const getResourceDetails = (id: string): DataverseItemDetails | undefined =>
  dataverseItems.find(dataverseItem => dataverseItem.id === id)

// eslint-disable-next-line max-lines-per-function
export const ServiceStorageSelection: FC = () => {
  const { t } = useTranslation(['common', 'share', 'publisher'])
  const [activeTab, setActiveTab] = useState<Tab>('left')
  const [selectedService, setSelectedService] = useState<DataverseItemDetails | null>(null)
  const currentLng = activeLanguageWithDefault().lng
  const selectedServiceRef = useRef<HTMLDivElement | null>(null)

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
      const resourceDetails = getResourceDetails(id)

      if (resourceDetails && isService(resourceDetails)) {
        setSelectedService(resourceDetails)
      }
    },
    []
  )

  const handleClose = useCallback(() => {
    setSelectedService(null)
  }, [])

  const handleDetailsEscape = useCallback(
    (event: KeyboardEvent) => {
      event.key === 'Escape' && handleClose()
    },
    [handleClose]
  )

  useOnKeyboard(handleDetailsEscape)

  useEffect(() => {
    if (selectedService)
      selectedServiceRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
  }, [selectedService])

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
        className={classNames('okp4-dataverse-portal-share-dataset-page-services-container', {
          detailed: !!selectedService
        })}
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
                  const isServiceSelected = selectedService?.id === id
                  return (
                    <DataverseItemCard
                      button={
                        <Button
                          className={classNames({ 'selected-button': isServiceSelected })}
                          label={t(isServiceSelected ? 'selected' : 'select')}
                          onClick={handleSelect(id)}
                        />
                      }
                      className={classNames('okp4-dataverse-portal-share-dataset-page-service', {
                        selected: isServiceSelected
                      })}
                      key={id}
                      label={properties.find(p => p.property === 'title')?.value ?? ''}
                      ref={isServiceSelected ? selectedServiceRef : undefined}
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
      {!!selectedService && (
        <div className="okp4-dataverse-portal-share-dataset-page-service-details-container">
          <div className="okp4-dataverse-portal-share-dataset-page-service-details-scroll-container">
            <DetailedDataverseItem
              data={selectedService}
              metadata={serviceGeneralMetadata}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  )
}
