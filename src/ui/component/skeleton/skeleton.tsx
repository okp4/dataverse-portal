import type { FC } from 'react'
import classNames from 'classnames'
import './skeleton.scss'

type SkeletonProps = {
  width?: number
  height?: number
  fontSize?: number
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular'
}

export const Skeleton: FC<SkeletonProps> = ({ width, height, variant = 'text', fontSize }) => {
  const classSkeleton = classNames('okp4-dataverse-portal-skeleton', variant)
  return (
    <div
      className={classSkeleton}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        fontSize: fontSize ? `${fontSize}px` : '100%'
      }}
    ></div>
  )
}
