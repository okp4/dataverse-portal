import type { FC } from 'react'
import './description.scss'

type DescriptionProps = {
  type: string
  text: string
  label: string
}

const Description: FC<DescriptionProps> = ({ type, label, text }): JSX.Element => (
  <>
    <div className='okp4-dataverse-portal-dataverse-component-description-tags'>{type}</div>
    <div className='okp4-dataverse-portal-dataverse-component-description-label'>{label}</div>
    <div className='okp4-dataverse-portal-dataverse-component-description-text'>{text}</div>
  </>
)

export default Description
