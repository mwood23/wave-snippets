import domToImage, { Options } from 'dom-to-image'
import GIFBuilder from 'gif.js.optimized'
import { useEffect, useReducer, useRef } from 'react'

import { UnreachableCaseError, noop } from '../utils'

const DEFAULT_SNAPSHOT_FREQUENCY = 50

type GIFBuilderConfig = {
  /**
   * Number of web workers to spawn. Defaults to [navigator.concurrentHardware](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware)
   * and falls back to four if that's no available.
   *
   */
  workers: number
  /**
   * Pixel sample interval, lower is better
   *
   * @default 10
   */
  quality: number
  /**
   * 	URL to load worker script from. Place this script where your website is served from. For create-react-app, it's /public.
   *
   * @default '/gif.worker.js'
   */
  workerScript: string
  /**
   * Repeat count, -1 = no repeat, 0 = forever
   */
  repeat: number
  /**
   * Background color where source image is transparent
   */
  background: string
  /**
   * 	Output image width. Defaults to the width of the node you pass into the hook.
   */
  width: number
  /**
   * 	Output image height. Defaults to the width of the node you pass into the hook.
   */
  height: number
  /**
   * 	Transparent hex color, 0x00FF00 = green
   */
  transparent: string
  /**
   * 	Dithering method, e.g. Flo
   */
  dither:
    | boolean
    | 'FloydSteinberg'
    | 'FloydSteinberg-serpentine'
    | 'FalseFloydSteinberg'
    | 'FalseFloydSteinberg-serpentine'
    | 'Stucki'
    | 'Atkinson'
  /**
   * Whether to print debug information to console
   */
  debug: boolean
}

type RenderGIFOptions = {
  /**
   * The number in milliseconds that an image is snapped of the given dom element.
   */
  frequency?: number

  exportSize?: number

  gifJSConfig?: Partial<GIFBuilderConfig>

  /**
   * Config passed to the image capturer
   */
  imageCaptureConfig?: Partial<Options>

  /**
   * Called on start of recording the DOM element
   */
  onRecordStart?: () => void

  /**
   * Called on start of building GIF
   */
  onBuildGIFStart?: () => void

  /**
   * Called when rendering GIF complete. Returns blob version of GIF
   */
  onRenderComplete?: (blob: Blob) => void
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

const buildImageElements = async (images: string[]) =>
  Promise.all(
    images.map(
      (myBlob) =>
        new Promise(function (resolved) {
          const i = new Image()
          i.onload = function () {
            // wait for the onload to get the width and height
            resolved(i)
          }

          i.src = myBlob
        }),
    ),
  )

export const useRenderGIF = (
  {
    frequency = DEFAULT_SNAPSHOT_FREQUENCY,
    gifJSConfig = {},
    imageCaptureConfig = {},
    onRenderComplete = noop,
    onRecordStart = noop,
    onBuildGIFStart = noop,
  }: RenderGIFOptions = {
    frequency: DEFAULT_SNAPSHOT_FREQUENCY,
    exportSize: 2,
    gifJSConfig: {},
    imageCaptureConfig: {},
    onRenderComplete: noop,
    onRecordStart: noop,
    onBuildGIFStart: noop,
  },
): [{ ref: typeof elementToGIF }, typeof dispatch, RenderGIFState] => {
  const elementToGIF = useRef<any>()
  const snapshotIntervalID = useRef<any>()

  const [state, dispatch] = useReducer(renderGIFReducer, initialRenderGIFState)
  const imagesToRender = useRef<string[]>([]) // base64 data URLs
  const { isRecording, isBuildingGIF } = state

  useEffect(() => {
    if (isRecording && elementToGIF.current) {
      onRecordStart()
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
          ...imageCaptureConfig,
        })

        imagesToRender.current.push(image)
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
      onBuildGIFStart()
      const imageElements = await buildImageElements(imagesToRender.current)

      const gif = new GIFBuilder({
        workers: navigator.hardwareConcurrency ?? 4,
        quality: 5,
        workerScript: '/gif.worker.js',
        delay: 0,
        ...gifJSConfig,
      })

      imageElements.forEach((img) =>
        // This adds a delay between the frames. By keeping it synced up with the snapshot frequency no frame will be wasted
        // and keep the GIF 1:1 with what we're recording
        gif.addFrame(img, { delay: DEFAULT_SNAPSHOT_FREQUENCY }),
      )

      gif.on('finished', function (blob: Blob) {
        dispatch({ type: 'renderComplete' })
        onRenderComplete(blob)
      })

      gif.render()
    }

    if (isBuildingGIF) {
      buildGIF()
    }
  }, [isBuildingGIF])

  return [{ ref: elementToGIF }, dispatch, state]
}
