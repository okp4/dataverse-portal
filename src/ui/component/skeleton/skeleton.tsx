import type { CSSProperties, FC } from 'react'
import classNames from 'classnames'
import './skeleton.scss'

type SkeletonProps = {
  width?: number | string
  height?: number | string
  fontSize?: number | string
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular'
  className?: string
  style?: CSSProperties
  count?: number
}

export const Skeleton: FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  fontSize,
  className,
  style,
  count = 1
}) => {
  const isRounded = variant === 'rounded'

  if (isRounded && !height) {
    throw new Error(
      "A height must be provided when using the 'rounded' variant of Skeleton component."
    )
  }

  const borderRadius =
    isRounded &&
    (typeof height === 'number' ? `${Math.round(height * 0.5)}px` : `calc(${height} * 0.5)`)

  const classSkeleton = classNames('okp4-dataverse-portal-skeleton', variant, className)

  const mergedStyle: CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...(fontSize ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...style
  }

  const renderSkeletons = (): JSX.Element[] =>
    Array(count)
      .fill(null)
      .map((_, i) => <div className={classSkeleton} key={i} style={mergedStyle}></div>)

  return <>{renderSkeletons()}</>
}
