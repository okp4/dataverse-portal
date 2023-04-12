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
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {})
  }

  const isRounded = variant === 'rounded'
  if (isRounded && !height) {
    console.error(
      "A height must be provided when using the 'rounded' variant of Skeleton component."
    )
  }
  if (isRounded && height) {
    const borderRadius =
      typeof height === 'number' ? `${Math.round(height * 0.5)}px` : `calc(${height} * 0.5)`
    mergedStyle.borderRadius = borderRadius
  }

  return (
    <div
      className={classNames('okp4-dataverse-portal-skeleton', variant)}
      style={mergedStyle}
    ></div>
  )
}
