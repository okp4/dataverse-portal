import type { FC } from 'react'
import { useAppStore } from '@/store/appStore'
import { ReactComponent as Okp4FullLogoDark } from '@/asset/logo/okp4-full-logo-dark.svg'
import { ReactComponent as Okp4FullLogoLight } from '@/asset/logo/okp4-full-logo-light.svg'
import { ReactComponent as Okp4LogoDark } from '@/asset/logo/okp4-logo-dark.svg'
import { ReactComponent as Okp4LogoLight } from '@/asset/logo/okp4-logo-light.svg'

type Okp4LogoProps = {
  logoOnly?: boolean
}

export const Okp4Logo: FC<Okp4LogoProps> = ({ logoOnly = false }) => {
  const theme = useAppStore(store => store.theme)
  const getLogoElement = (): JSX.Element => {
    if (theme === 'light') return logoOnly ? <Okp4LogoLight /> : <Okp4FullLogoLight />
    return logoOnly ? <Okp4LogoDark /> : <Okp4FullLogoDark />
  }
  return <>{getLogoElement()}</>
}
