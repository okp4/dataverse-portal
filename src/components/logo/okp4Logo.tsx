'use client'
import type { FC } from 'react'
import Image from 'next/image'
import okp4LightFullLogo from '../../../public/icons/okp4-full-logo-light.svg'
import okp4DarkFullLogo from '../../../public/icons/okp4-full-logo-dark.svg'
import okp4DarkLogo from '../../../public/icons/okp4-logo-dark.svg'
import okp4LightLogo from '../../../public/icons/okp4-logo-light.svg'
import { useTheme } from '@/hooks/useTheme'

type Okp4LogoProps = {
  logoOnly?: boolean
}

export const Okp4Logo: FC<Okp4LogoProps> = ({ logoOnly = false }) => {
  const { theme } = useTheme()
  const getSrc = (): string => {
    if (theme === 'light') return logoOnly ? okp4LightLogo : okp4LightFullLogo
    return logoOnly ? okp4DarkLogo : okp4DarkFullLogo
  }
  return <Image alt="okp4-lateral-bar-logo" src={getSrc()} />
}
