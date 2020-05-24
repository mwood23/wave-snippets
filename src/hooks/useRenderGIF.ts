// @ts-ignore
import domToImage from 'dom-to-image-more'
import GIFBuilder from 'gif.js.optimized'
import { useEffect, useReducer, useRef, useState } from 'react'

import { UnreachableCaseError } from '../utils'

const DEFAULT_SNAPSHOT_FREQUENCY = 50

type RenderGIFOptions = {
  /**
   * The number in milliseconds that an image is snapped of the given dom element.
   */
  frequency: number

  exportSize: number
}

type RenderGIFState = {
  isLoading: boolean
  isRecording: boolean
  isBuildingGIF: boolean
}

const initialRenderGIFState: RenderGIFState = {
  isLoading: false,
  isRecording: false,
  isBuildingGIF: false,
}

type RenderGIFAction =
  | {
      type: 'startRender'
    }
  | {
      type: 'startRecording'
    }
  | {
      type: 'stopRecording'
    }
  | {
      type: 'startGIFBuilding'
    }
  | {
      type: 'renderComplete'
    }

const renderGIFReducer = (state: RenderGIFState, action: RenderGIFAction) => {
  switch (action.type) {
    case 'startRender':
      return { ...state, isLoading: true, isRecording: true }
    case 'startRecording':
      return { ...state, isLoading: true, isRecording: true }
    case 'stopRecording':
      return { ...state, isRecording: false }
    case 'startGIFBuilding':
      return { ...state, isBuildingGIF: true }
    case 'renderComplete':
      return {
        ...state,
        isLoading: false,
        isRecording: false,
        isBuildingGIF: false,
      }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

const buildImageElements = async (images: string[]) => {
  return Promise.all(
    images.map((myBlob) => {
      return new Promise(function (resolved) {
        const i = new Image()
        i.onload = function () {
          // wait for the onload to get the width and height
          resolved(i)
        }

        i.src = myBlob
      })
    }),
  )
}

export const useRenderGIF = (
  { frequency = DEFAULT_SNAPSHOT_FREQUENCY }: RenderGIFOptions = {
    frequency: DEFAULT_SNAPSHOT_FREQUENCY,
    exportSize: 2,
  },
): [{ ref: typeof elementToGIF }, typeof dispatch, RenderGIFState] => {
  const elementToGIF = useRef<any>()
  const snapshotIntervalID = useRef<NodeJS.Timeout>()

  const [state, dispatch] = useReducer(renderGIFReducer, initialRenderGIFState)
  const [images, setImages] = useState<string[]>([]) // base64 data URLs
  const { isRecording, isBuildingGIF } = state

  useEffect(() => {
    if (isRecording && elementToGIF.current) {
      const takeSnapshotOfElement = async () => {
        const node = elementToGIF.current!

        const scale = 750 / node.offsetWidth

        const image = await domToImage.toPng(elementToGIF.current!, {
          height: node.offsetHeight * scale,
          width: node.offsetWidth * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
            width: node.offsetWidth + 'px',
            height: node.offsetHeight + 'px',
          },
        })

        setImages((prevImages) => {
          return [...prevImages, image]
        })
      }

      snapshotIntervalID.current = setInterval(takeSnapshotOfElement, frequency)
    }

    if (!isRecording && snapshotIntervalID.current) {
      clearInterval(snapshotIntervalID.current)

      dispatch({ type: 'startGIFBuilding' })
    }
  }, [isRecording, frequency])

  useEffect(() => {
    const buildGIF = async () => {
      console.log('build gif')
      const imageElements = await buildImageElements(images)

      const gif = new GIFBuilder({
        workers: 4,
        quality: 10,
        workerScript: '/gif.worker.js',
        delay: 0,
      })

      imageElements.forEach((img) => {
        // This adds a delay between the frames. By keeping it synced up with the snapshot frequency no frame will be wasted
        // and keep the GIF 1:1 with what we're recording
        return gif.addFrame(img, { delay: DEFAULT_SNAPSHOT_FREQUENCY })
      })

      gif.on('finished', function (blob: any) {
        console.log('finish', blob, URL.createObjectURL(blob))
        window.open(URL.createObjectURL(blob))

        dispatch({ type: 'renderComplete' })
      })

      gif.render()
    }

    if (isBuildingGIF) {
      buildGIF()
    }
  }, [isBuildingGIF])

  return [{ ref: elementToGIF }, dispatch, state]
}
