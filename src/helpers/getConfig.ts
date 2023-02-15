import type { Config } from 'pages/api/config'

export const getConfig = async (): Promise<Config> => {
  const response = await fetch(`${process.env.API_URL}/config`)
  const config: Config = await response.json()
  return config
}
