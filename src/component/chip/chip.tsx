import classNames from 'classnames'
import './chip.scss'

type ChipProps = {
  label: string
  className?: string
  isSelected?: boolean
  icon?: JSX.Element
  onClick?: () => void
}

const Chip = ({ label, className, isSelected = false, icon, onClick }: ChipProps): JSX.Element => {
  const selectedClassname = { selected: isSelected }
  return (
    <div
      className={classNames('okp4-dataverse-portal-chip-main', className, selectedClassname)}
      onClick={onClick}
    >
      <div className="okp4-dataverse-portal-chip-content">
        {icon && (
          <div className={classNames('okp4-dataverse-portal-chip-icon', selectedClassname)}>
            {icon}
          </div>
        )}
        <p className={classNames('okp4-dataverse-portal-chip-label', selectedClassname)}>{label}</p>
      </div>
    </div>
  )
}

export default Chip
