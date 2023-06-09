import { useCallback } from 'react'
import type { FC } from 'react'
import classNames from 'classnames'
import './tabs.scss'

export type Tab = 'left' | 'right'

type TabsProps = {
  activeTab: Tab
  leftTabLabel: string
  rightTabLabel: string
  handleTabChange: (tab: Tab) => void
  disabledTab?: Tab
}

export const Tabs: FC<TabsProps> = ({
  activeTab,
  leftTabLabel,
  rightTabLabel,
  handleTabChange,
  disabledTab
}) => {
  const tabs: [Tab, Tab] = ['left', 'right']

  const handleTabSelection = useCallback(
    (tab: Tab) => () => {
      activeTab === tab && handleTabChange(tab)
    },
    [activeTab, handleTabChange]
  )

  return (
    <div
      className={classNames('okp4-dataverse-portal-tabs-main', {
        disabled: !!disabledTab
      })}
    >
      {tabs.map((tab: Tab) => (
        <div
          className={classNames('okp4-dataverse-portal-tab', {
            disabled: disabledTab === tab,
            active: activeTab === tab
          })}
          key={tab}
          onClick={handleTabSelection(tab)}
        >
          {tab === 'left' ? leftTabLabel : rightTabLabel}
        </div>
      ))}
    </div>
  )
}
