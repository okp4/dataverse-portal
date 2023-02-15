import type { NextApiRequest, NextApiResponse } from 'next'

export type MetaData = {
  title: string
  keywords: string
  description: string
  icons: { icon: string }
}

export type Config = {
  app: {
    metadata: MetaData
    apiUrl: string
  }
}

export default function handler(_req: NextApiRequest, res: NextApiResponse): void {
  const config: Config = {
    app: {
      metadata: {
        title: process.env.APP_TITLE,
        keywords: process.env.APP_KEYWORDS,
        description: process.env.APP_DESCRIPTION,
        icons: { icon: process.env.APP_ICON }
      },
      apiUrl: process.env.API_URL
    }
  }
  return res.status(200).json(config)
}
