import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { UnsupportedFeature } from '@/ui/view/unsupportedFeature/unsupportedFeature'

export const UnsupportedFeatureLayout: FC = () => {
  const { isTablet, isMobile } = useBreakpoint()
  return isTablet || isMobile ? <UnsupportedFeature /> : <Outlet />
}
