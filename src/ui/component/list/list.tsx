import type { FC, ReactNode } from 'react'
import classNames from 'classnames'
import './list.scss'

type ListItemProps = {
  leftElement?: ReactNode
  content?: ReactNode
  rightElement?: ReactNode
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  className?: string
}

export const ListItem: FC<ListItemProps> = ({
  leftElement,
  rightElement,
  content,
  onClick,
  className
}) => (
  <li
    className={classNames('okp4-dataverse-portal-list-item-main', className, {
      clickable: onClick
    })}
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
