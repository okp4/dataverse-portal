import type { FC, ReactElement } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'
import './list.scss'

const gridTemplateColumnClasses = (
  leftElement?: ReactElement,
  rightElement?: ReactElement
): string => {
  if (leftElement && rightElement) return 'list-item-3-columns'
  if (leftElement) return 'list-item-2-columns-left'
  if (rightElement) return 'list-item-2-columns-right'
  return 'list-item-1-column'
}

export type Item = {
  id: string
  className?: string
  content: ReactElement
  leftElement?: ReactElement
  rightElement?: ReactElement
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

type ListProps = {
  items: Item[]
  className?: string
}

export const List: FC<ListProps> = ({ items, className }) => (
  <ul className={classNames('okp4-dataverse-portal-list-main', className)}>
    <TransitionGroup className="okp4-dataverse-portal-list-container">
      {items.map(({ leftElement, rightElement, content, className, id, onClick }) => (
        <CSSTransition classNames="transition" key={id} timeout={400}>
          <li
            className={classNames(
              'okp4-dataverse-portal-list-item-main',
              { clickable: onClick },
              gridTemplateColumnClasses(leftElement, rightElement),
              className
            )}
            key={id}
            onClick={onClick}
          >
            {leftElement}
            {content}
            {rightElement}
          </li>
        </CSSTransition>
      ))}
    </TransitionGroup>
  </ul>
)
