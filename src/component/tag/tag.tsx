import classNames from 'classnames'
import './tag.scss'

export type ColorVariant = 'primary-color' | 'primary-color-variant-3' | 'primary-color-variant-4'

type TagProps = {
  label: string
  colorVariant?: ColorVariant
}

const Tag = ({ label, colorVariant = 'primary-color-variant-3' }: TagProps): JSX.Element => (
  <div className={classNames('okp4-dataverse-portal-tag-main', colorVariant)}>{label}</div>
)

export default Tag
