import { ThemeProvider } from '@/components/providers/themeProvider'
import { getConfig } from '@/helpers/getConfig'
import type { Config, MetaData } from 'pages/api/config'

export const generateMetadata = async (): Promise<MetaData> => {
  const config: Config = await getConfig()
  return config.app.metadata
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
