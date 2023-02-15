'use client'
import dynamic from 'next/dynamic'
import '../styles/styles.scss'
import LateralBar from '@/components/lateralBar/lateralBar'

const ThemeProvider = dynamic(async () => import('@/components/providers/themeProvider'), {
  ssr: false
})

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ThemeProvider>
          <div className="okp4-dataverse-portal-root">
            <LateralBar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
