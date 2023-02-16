export type Route = {
  id: string
  name: string
  path: string
  group: string
}

export const appRoutes: Route[] = [
  { id: 'home', name: 'Home', path: '/', group: 'general' },
  { id: 'explore', name: 'Explore', path: '/catalog', group: 'general' },
  { id: 'dataspaces', name: 'My Data Spaces', path: '/dataspace', group: 'general' },
  { id: 'share', name: 'Share Data & Services', path: '/sharing', group: 'interact' },
  {
    id: 'create-knowledge',
    name: 'Create Knowledge',
    path: '/knowledge-builder',
    group: 'interact'
  },
  {
    id: 'create-dataspace',
    name: 'Create Data Space',
    path: '/dataspace-builder',
    group: 'interact'
  },
  { id: 'build-apps', name: 'Build Applications', path: '/app-builder', group: 'interact' },
  { id: 'documentation', name: 'Documentation', path: '/documentation', group: 'learn' },
  { id: 'help', name: 'Help Center', path: '/help', group: 'learn' }
]
