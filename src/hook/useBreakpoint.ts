import { useMediaType } from './useMediaType'

export type Breakpoints = {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
}

export const useBreakpoint = (): Breakpoints => ({
  isMobile: useMediaType('(max-width: 595px)'), // Mobile device.
  isTablet: useMediaType('(min-width: 596px) and (max-width: 1439px)'), // Tablet device.
  isDesktop: useMediaType('(min-width: 1440px) and (max-width: 1919px)'), // Desktop screen.
  isLargeDesktop: useMediaType('(min-width: 1920px) ') // Large desktop screen.
})
