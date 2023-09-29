import { useRef, useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import classNames from 'classnames'
import * as O from 'fp-ts/Option'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { useAppStore, useDataverseStore } from '@/ui/store'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import { loadingDataverseCards } from '@/ui/view/loadingDataverseCards/loadingDataverseCards'
import type { Tab } from '@/ui/view/tabs/tabs'
import { Tabs } from '@/ui/view/tabs/tabs'
import type { DataverseItem } from '@/ui/types'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { LottieLoader } from '@/ui/component/loader/lottieLoader'
import threeDots from '@/ui/asset/animations/threeDots.json'
import { isService, serviceGeneralMetadata } from '@/ui/page/dataverse/service/service'
import { DetailedDataverseItem } from '@/ui/view/dataverse/component/dataverseItemDetails/detailedDataverseItem'
import { dataverseItems } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import '@/ui/page/share/i18n/index'
import './serviceStorageSelection.scss'

export const getResourceDetails = (id: string): DataverseItemDetails | undefined =>
  dataverseItems.find(dataverseItem => dataverseItem.id === id)

// eslint-disable-next-line max-lines-per-function
export const ServiceStorageSelection: FC = () => {
  const { t } = useTranslation(['common', 'share', 'publisher'])
  const [activeTab, setActiveTab] = useState<Tab>('left')
  const currentLng = activeLanguageWithDefault().lng
  const selectedServiceRef = useRef<HTMLDivElement | null>(null)
  const serviceContainerRef = useRef<HTMLDivElement | null>(null)
  const dispatchNotification = useDispatchNotification()
  const { setStorageServiceId, storageServiceId } = useAppStore(store => ({
    storageServiceId: store.shareData.storageServiceId,
    setStorageServiceId: store.shareData.setStorageServiceId
  }))

  const {
    loadDataverse,
    dataverse,
    setByTypeFilter,
    byPropertyFilter,
    setByPropertyFilter,
    isLoading,
    hasNext,
    setLanguage,
    error,
    resetByTypeFilter,
    resetByPropertyFilter,
    setByServiceCategoryFilter,
    resetByServiceCategoryFilter
  } = useDataverseStore(state => ({
    loadDataverse: state.loadDataverse,
    dataverse: state.dataverse,
    isLoading: state.isLoading,
    hasNext: state.hasNext,
    setLanguage: state.setLanguage,
    byPropertyFilter: state.byPropertyFilter,
    setByPropertyFilter: state.setByPropertyFilter,
    setByTypeFilter: state.setByTypeFilter,
    error: state.error,
    resetByTypeFilter: state.resetByTypeFilter,
    resetByPropertyFilter: state.resetByPropertyFilter,
    setByServiceCategoryFilter: state.setByServiceCategoryFilter,
    resetByServiceCategoryFilter: state.resetByServiceCategoryFilter
  }))

  const handleServiceSearch = useCallback(
    (searchTearm: string) => {
      setStorageServiceId(O.none)()
      setByPropertyFilter({ property: 'title', value: searchTearm })()
      loadDataverse()()
    },
    [loadDataverse, setByPropertyFilter, setStorageServiceId]
  )

  const handleSelect = useCallback(
    (id: string) => () => {
      const resourceDetails = getResourceDetails(id)

      if (resourceDetails && isService(resourceDetails)) {
        setStorageServiceId(O.some(id))()
      }
    },
    [setStorageServiceId]
  )

  const handleClose = useCallback(() => {
    setStorageServiceId(O.none)()
  }, [setStorageServiceId])

  const handleDetailsEscape = useCallback(
    (event: KeyboardEvent) => {
      event.key === 'Escape' && handleClose()
    },
    [handleClose]
  )

  useOnKeyboard(handleDetailsEscape)

  const handleServicesError = useCallback(() => {
    dispatchNotification({
      type: 'error',
      titleKey: 'error.problem',
      messageKey: 'error.processing',
      action: 'refresh'
    })
  }, [dispatchNotification])

  useEffect(() => {
    O.map(handleServicesError)(error()())
  }, [error, handleServicesError])

  useEffect(() => {
    if (!selectedServiceRef.current || !serviceContainerRef.current) return

    const scrollTop = serviceContainerRef.current.scrollTop
    // offsetTop is relative to the offsetParent,
    // which is the closest ancestor in the DOM tree with position: relative
    const offsetTop = selectedServiceRef.current.offsetTop

    serviceContainerRef.current.scrollBy({
      top: offsetTop - scrollTop,
      behavior: 'smooth'
    })
  }, [selectedServiceRef, serviceContainerRef, storageServiceId])

  useEffect(() => {
    setLanguage(currentLng)()
    setByTypeFilter('Service')()
    setByServiceCategoryFilter(O.some('Storage'))()
    loadDataverse()()
    return () => {
      resetByPropertyFilter()()
      resetByTypeFilter()()
      resetByServiceCategoryFilter()()
    }
  }, [
    currentLng,
    loadDataverse,
    setByTypeFilter,
    setLanguage,
    resetByTypeFilter,
    resetByPropertyFilter,
    setByServiceCategoryFilter,
    resetByServiceCategoryFilter
  ])

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
      <div className="okp4-dataverse-portal-share-dataset-page-service-selection-search-container">
        <SearchBar
          onSearch={handleServiceSearch}
          placeholder={t('share:share.dataset.serviceStorageSearch')}
          value={byPropertyFilter()()}
        />
        <div
          className={classNames('okp4-dataverse-portal-share-dataset-page-services-container', {
            detailed: O.isSome(storageServiceId)
          })}
          id="scrollable-container"
          ref={serviceContainerRef}
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
                    const isServiceSelected = O.getOrElse(() => '')(storageServiceId) === id
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

          {!dataverse()().length && !isLoading()() && (
            <NoResultFound
              className="okp4-dataverse-portal-service-search-no-result-wrapper"
              iconName="large-magnifier-with-cross"
            />
          )}
        </div>
        {O.match(
          () => undefined,
          (storageServiceId: string) => (
            <div className="okp4-dataverse-portal-share-dataset-page-service-details-container">
              <div className="okp4-dataverse-portal-share-dataset-page-service-details-scroll-container">
                <DetailedDataverseItem
                  data={getResourceDetails(storageServiceId) as DataverseItemDetails}
                  metadata={serviceGeneralMetadata}
                  onClose={handleClose}
                />
              </div>
            </div>
          )
        )(storageServiceId)}
      </div>
    </div>
  )
}
