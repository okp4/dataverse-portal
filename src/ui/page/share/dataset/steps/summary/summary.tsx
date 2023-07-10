/* eslint-disable max-lines-per-function */
import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFileStore } from '@/ui/store'
import { type Item, List } from '@/ui/component/list/list'
import { Icon } from '@/ui/component/icon/icon'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import './summary.scss'

export const Summary: FC = () => {
  const { t } = useTranslation('share')
  const { files } = useFileStore(state => ({
    files: state.filesDescriptor
  }))

  const certificationStatement = t('share:share.dataset.summaryCertify')

  const [isChecked, setChecked] = useState<boolean>(false)

  const items: Item[] = files()().map(({ id, name }) => ({
    content: <p>{name}</p>,
    id,
    key: id,
    leftElement: (
      <div>
        <Icon name="folder-outlined" />
      </div>
    )
  }))

  return (
    <div className="okp4-dataverse-portal-share-dataset-summary-container">
      <h2>{t('share:share.dataset.summary')}</h2>
      <div className="okp4-dataverse-portal-share-dataset-summary-left">
        <div className="okp4-dataverse-portal-share-dataset-summary-text">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
            amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut
            labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
            consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
            nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et
            quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
            voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui
            ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
            dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
            incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
            veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
            ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate
            velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
            voluptas nulla pariatur?
          </p>
        </div>
      </div>
      <div className="okp4-dataverse-portal-share-dataset-summary-right">
        <List
          classes={{ main: 'okp4-dataverse-portal-share-dataset-summary-file-list' }}
          items={items}
        />
        <div className="okp4-dataverse-portal-share-dataset-summary-know">HELLO</div>
      </div>
      <p className="okp4-dataverse-portal-share-dataset-summary-certify">
        <DynamicCheckbox
          checked={isChecked}
          highlightedTerm={''}
          key={certificationStatement}
          name={certificationStatement}
          onCheckedChange={setChecked}
          value={certificationStatement}
        />
      </p>
    </div>
  )
}
