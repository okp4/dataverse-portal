import { appRoutes } from '@/ui/routes'
import type { FC } from 'react'
import { Routes, Route } from 'react-router-dom'

export const AppRouter: FC = () => (
  <Routes>
    {appRoutes.map(({ id, path, element }) => (
      <Route element={element} key={id} path={path} />
    ))}
  </Routes>
)
