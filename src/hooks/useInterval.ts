import { useEffect, useRef } from 'react'

type Callback = () => void

type UseIntervalOptions = { delay: number; pause: boolean }

export const useInterval = (
  callback: Callback,
  { delay, pause = false }: UseIntervalOptions,
): void => {
  const savedCallback = useRef<Callback>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const handler = () => {
      return savedCallback.current && savedCallback.current()
    }

    if (!pause) {
      const id = setInterval(handler, delay)
      return () => {
        return clearInterval(id)
      }
    }
  }, [delay, pause])
}
