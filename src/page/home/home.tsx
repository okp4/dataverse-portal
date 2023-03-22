import type { FC } from 'react'
import { Community } from './community/community'
import { Interact } from './interact/interact'
import './home.scss'
import './i18n/index'

export const Home: FC = () => (
  <div className="okp4-dataverse-portal-home-page-main">
    <div className="okp4-dataverse-portal-home-page-block-container community">
      <Community />
    </div>
    <div className="okp4-dataverse-portal-home-page-block-container interact">
      <Interact />
    </div>
  </div>
)
