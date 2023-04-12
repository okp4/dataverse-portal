import type { CSSProperties, FC } from 'react'
import classNames from 'classnames'
import './skeleton.scss'

type SkeletonProps = {
  width?: number | string
  height?: number | string
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular'
}

export const Skeleton: FC<SkeletonProps> = ({ width, height, variant = 'text' }) => {
  const mergedStyle: CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  }

  return (
    <div
      className={classNames('okp4-dataverse-portal-skeleton-main', variant)}
      style={mergedStyle}
    ></div>
  )
}
