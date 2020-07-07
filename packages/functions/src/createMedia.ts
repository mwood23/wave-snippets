import os from 'os'
import path from 'path'

import { storage } from 'firebase-admin'
import { Request, Response } from 'firebase-functions'
import puppeteer from 'puppeteer'
import { Required } from 'utility-types'
import { number, object, string } from 'yup'

import { WAVE_DOWNLOAD_URL } from './const'
import { createGIF } from './utils/createGIF'
import { db } from './utils/store'
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
   * Name to give the export. Anything given will be slugified. If not provided, random id will be given
   */
  name?: string

  /**
   * Comma separated list of people to send the export notification to
   */
  emails: string

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
  | 'emails'
  | 'deviceScaleFactor'
  | 'width'
  | 'height'
  | 'id'
  | 'quality'
  | 'restingDuration'
>

export const createMediaValidationSchema = object().shape({
  id: string().required('ID is required.').trim(),
  emails: string().required(),
  quality: string().oneOf(['low', 'medium', 'high']).default(DEFAULT_QUALITY),
  height: number().default(VIEWPORT_OPTIONS.height),
  width: number().default(VIEWPORT_OPTIONS.width),
  deviceScaleFactor: number().default(VIEWPORT_OPTIONS.deviceScaleFactor),
  duration: number(),
  restingDuration: number().default(DEFAULT_RESTING_DURATION),
})

export const createMedia = async (req: Request, res: Response) => {
  // @ts-ignore
  console.log('User', req?.locals?.user)

  const createMediaParams = (await createMediaValidationSchema
    .validate(req.query, { abortEarly: false })
    .catch(({ errors }) => {
      res.status(400).send(errors)

      throw new Error('createMedia validation error.')
    })) as YupCreateMediaParams

  // TODO Create an entity in Firebase for the export so they can check the status.

  const URL = `${WAVE_DOWNLOAD_URL}/${createMediaParams.id}`
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

  const bucket = storage().bucket()

  // @ts-ignore Locals isn't typed :(
  const userIDOrAnonymous = () => req.locals?.user?.uid ?? 'anonymous'
  const SEVEN_DAYS = Date.now() + 7 * 24 * 60 * 60 * 1000

  const uploadAsset = (assetPath: string) =>
    bucket
      .upload(assetPath, {
        destination: `exports/${userIDOrAnonymous()}/${createMediaParams.id}`,
      })
      .then(([data]) =>
        data.getSignedUrl({
          expires: SEVEN_DAYS,
          action: 'read',
        }),
      )

  // Adding a random ID to the end since people could be exporting these multiple times
  // especially for public snippets

  try {
    const [videoURL, gifURL] = await Promise.all([
      uploadAsset(outputVideoFilePath),
      uploadAsset(outputGIFFilePath),
    ])

    await db.collection('mail').add({
      to: createMediaParams.emails.split(','),
      message: {
        subject: 'Your Wave Snippet Export is Ready!',
        text: '',
        html: `Hello,<br />Your snippies are ready!! Video: ${videoURL[0]}<br />Gif:${gifURL[0]}<br />Links expire in seven days!`,
      },
    })

    console.log('Emailed queued for delivery!')
  } catch (error) {
    console.log('Upload and send email err', error)
  }

  // TODO: Any cleanup needed for the functions like clearing out the temp dir?
  res.end()
  return
}
