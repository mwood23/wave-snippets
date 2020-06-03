import { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const ScrollToTop: FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
