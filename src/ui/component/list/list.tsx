import type { FC, ReactElement, ReactNode } from 'react'
import classNames from 'classnames'
import './list.scss'

type ListItemProps = {
  content: ReactElement
  leftElement?: ReactElement
  rightElement?: ReactElement
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  className?: string
}

const gridTemplateColumnClasses = (
  leftElement?: ReactElement,
  rightElement?: ReactElement
): string => {
  if (leftElement && rightElement) return 'list-item-3-columns'
  if (leftElement) return 'list-item-2-columns-left'
  if (rightElement) return 'list-item-2-columns-right'
  return 'list-item-1-column'
}

export const ListItem: FC<ListItemProps> = ({
  leftElement,
  rightElement,
  content,
  onClick,
  className
}) => (
  <li
    className={classNames(
      'okp4-dataverse-portal-list-item-main',
      { clickable: onClick },
      gridTemplateColumnClasses(leftElement, rightElement),
      className
    )}
    onClick={onClick}
  >
    {leftElement}
    {content}
    {rightElement}
  </li>
)

type ListProps = {
  children: ReactNode
  className?: string
}

export const List: FC<ListProps> = ({ children, className }) => (
  <ul className={classNames('okp4-dataverse-portal-list-main', className)}>{children}</ul>
)
