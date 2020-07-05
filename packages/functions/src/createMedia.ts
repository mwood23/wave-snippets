import os from 'os'
import path from 'path'

import { Request, Response } from 'firebase-functions'
import puppeteer from 'puppeteer'
import { Required } from 'utility-types'
import { number, object, string } from 'yup'

import { createGIF } from './utils/createGIF'
import timecut from './vendor/timecut'

const VIEWPORT_OPTIONS = {
  height: 465,
  width: 648,
  deviceScaleFactor: 2,
}
const DEFAULT_RESTING_DURATION = 2
const DEFAULT_QUALITY: CreateMediaQuality = 'medium'

export type CreateMediaQuality = 'low' | 'medium' | 'high'
export type CreateMediaParams = {
  /**
   * ID of the snippet to create media from.
   */
  id: string

  /**
   * Quality of the export. This is the frame per second mostly. Large snippets might run
   * into time limits with the cloud functions timeout of 9 minutes.
   *
   * @default
   * 'medium'
   */
  quality?: CreateMediaQuality

  /**
   * Height of export
   */
  height?: number

  /**
   * Width of export
   */
  width?: number

  /**
   * Device scale factor for high res exports.
   *
   * @default
   * 2
   */
  deviceScaleFactor?: number

  /**
   * Duration of the export in seconds. This is automatically calculated, but can be overridden.
   */
  duration?: number

  /**
   * How long the snippet rests at the end of the animation in seconds. Set to 0 if you want
   * the export to stop immediately at the end of the animation. Most likely you want some
   * time for it to rest.
   *
   * @default
   * 2
   */
  restingDuration?: number
}

// Types are blown so we're helping them out here
type YupCreateMediaParams = Required<
  CreateMediaParams,
  | 'deviceScaleFactor'
  | 'width'
  | 'height'
  | 'id'
  | 'quality'
  | 'restingDuration'
>

const createMediaValidationSchema = object().shape({
  id: string().required('ID is required.').trim(),
  quality: string().oneOf(['low', 'medium', 'high']).default(DEFAULT_QUALITY),
  height: number().default(VIEWPORT_OPTIONS.height),
  width: number().default(VIEWPORT_OPTIONS.width),
  deviceScaleFactor: number().default(VIEWPORT_OPTIONS.deviceScaleFactor),
  duration: number().default(DEFAULT_RESTING_DURATION),
})

export const createMedia = async (req: Request, res: Response) => {
  const createMediaParams = (await createMediaValidationSchema
    .validate(req.query, { abortEarly: false })
    .catch(({ errors }) => {
      res.status(400).send(errors)

      throw new Error('createMedia validation error.')
    })) as YupCreateMediaParams

  // TODO Create an entity in Firebase for the export so they can check the status.
  res.status(200).send({
    code: 'SUCCESS',
    msg: `Creating your snippet now.`,
  })

  const URL = `http://localhost:3000/download/${createMediaParams.id}`
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  })

  const viewportOptions = {
    height: createMediaParams.height,
    width: createMediaParams.width,
    deviceScaleFactor: createMediaParams.deviceScaleFactor,
  }
  let duration = createMediaParams.duration

  if (!duration) {
    const page = await browser.newPage()
    await page.setViewport(viewportOptions)
    await page.goto(URL)
    console.log(
      `Going to ${URL} and waiting for snippet to load to grab duration...`,
    )

    await page.waitForSelector('.code-snippet-preview-container')
    console.log('Snippet preview rendered')
    const startTime = new Date().getTime()

    await page.waitForSelector(
      '.code-snippet-preview-container.snippet-preview-complete',
    )
    const endTime = new Date().getTime()
    duration = +((endTime - startTime) / 1000).toFixed(2)

    console.log(
      'Snippet preview complete!',
      `Duration of snippet: ${duration} seconds`,
    )
  }

  // @ts-ignore Checked above, compiler just being fussy
  duration += createMediaParams.restingDuration

  const tempDirectory = os.tmpdir()
  const outputFileName = (extension: 'mp4' | 'gif') =>
    `test--${new Date().getTime()}.${extension}`
  const outputVideoFilePath = path.join(tempDirectory, outputFileName('mp4'))
  const outputGIFFilePath = path.join(tempDirectory, outputFileName('gif'))

  // This write a file to the tmp directory when complete
  await timecut({
    url: URL,
    tempDir: tempDirectory,
    output: outputFileName('mp4'),
    duration,
    keepFrames: true,
    fps: 20,
    browser,
    viewportOptions,
  })

  console.log('Timecut complete!')

  await createGIF({
    inputFile: outputVideoFilePath,
    outputFile: outputGIFFilePath,
  })

  console.log('Gif creation complete!')

  await browser.close()

  // TODO: Upload to buckets

  // TODO: Any cleanup needed for the functions like clearing out the temp dir?
  return
}
