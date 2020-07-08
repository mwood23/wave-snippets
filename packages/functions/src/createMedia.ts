import os from 'os'
import path from 'path'

import { storage } from 'firebase-admin'
import { Request, Response } from 'firebase-functions'
import puppeteer from 'puppeteer'
import { Required } from 'utility-types'
import { number, object, string } from 'yup'

import { WAVE_DOWNLOAD_URL } from './const'
import { createGIF } from './utils/createGIF'
import { reportError } from './utils/errors'
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
        subject: '🌊 Radical! Your Wave Snippet is Ready!',
        text: `Hey there,

Your Wave Snippet is ready! Links expire in <b>seven days</b>.

MP4:
${videoURL[0]}

Gif:
${gifURL[0]}

Stay wavey,
The Wave Snippets team
`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Actionable emails e.g. reset password</title>
<style>
* {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  font-size: 14px;
}

img {
  max-width: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: none;
  width: 100% !important;
  height: 100%;
  line-height: 1.6em;
  /* 1.6em * 14px = 22.4px, use px to get airier line-height also in Thunderbird, and Yahoo!, Outlook.com, AOL webmail clients */
  /*line-height: 22px;*/
}

/* Let's make sure all tables have defaults */
table td {
  vertical-align: top;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
body {
  background-color: #f6f6f6;
}

.body-wrap {
  background-color: #f6f6f6;
  width: 100%;
}

.container {
  display: block !important;
  max-width: 600px !important;
  margin: 0 auto !important;
  /* makes it centered */
  clear: both !important;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  display: block;
  padding: 20px;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
}

.content-wrap {
  padding: 20px;
}

.content-block {
  padding: 0 0 20px;
}

.header {
  width: 100%;
  margin-bottom: 20px;
}

.footer {
  width: 100%;
  clear: both;
  color: #999;
  padding: 20px;
}
.footer p, .footer a, .footer td {
  color: #999;
  font-size: 12px;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1, h2, h3 {
  font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  color: #000;
  margin: 40px 0 0;
  line-height: 1.2em;
  font-weight: 400;
}

h1 {
  font-size: 32px;
  font-weight: 500;
  /* 1.2em * 32px = 38.4px, use px to get airier line-height also in Thunderbird, and Yahoo!, Outlook.com, AOL webmail clients */
  /*line-height: 38px;*/
}

h2 {
  font-size: 24px;
  /* 1.2em * 24px = 28.8px, use px to get airier line-height also in Thunderbird, and Yahoo!, Outlook.com, AOL webmail clients */
  /*line-height: 29px;*/
}

h3 {
  font-size: 18px;
  /* 1.2em * 18px = 21.6px, use px to get airier line-height also in Thunderbird, and Yahoo!, Outlook.com, AOL webmail clients */
  /*line-height: 22px;*/
}

h4 {
  font-size: 14px;
  font-weight: 600;
}

p, ul, ol {
  margin-bottom: 10px;
  font-weight: normal;
}
p li, ul li, ol li {
  margin-left: 5px;
  list-style-position: inside;
}

/* -------------------------------------
    LINKS & BUTTONS
------------------------------------- */
a {
  color: #348eda;
  text-decoration: underline;
}

.btn-primary {
  text-decoration: none;
  color: #FFF;
  background-color: #348eda;
  border: solid #348eda;
  border-width: 10px 20px;
  line-height: 1em;
  /* 2em * 14px = 28px, use px to get airier line-height also in Thunderbird, and Yahoo!, Outlook.com, AOL webmail clients */
  /*line-height: 28px;*/
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  border-radius: 5px;
  text-transform: capitalize;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
  margin-bottom: 0;
}

.first {
  margin-top: 0;
}

.aligncenter {
  text-align: center;
}

.alignright {
  text-align: right;
}

.alignleft {
  text-align: left;
}

.clear {
  clear: both;
}

/* -------------------------------------
    ALERTS
    Change the class depending on warning email, good email or bad email
------------------------------------- */
.alert {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  padding: 20px;
  text-align: center;
  border-radius: 3px 3px 0 0;
}
.alert a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
}
.alert.alert-warning {
  background-color: #FF9F00;
}
.alert.alert-bad {
  background-color: #D0021B;
}
.alert.alert-good {
  background-color: #68B90F;
}

/* -------------------------------------
    INVOICE
    Styles for the billing table
------------------------------------- */
.invoice {
  margin: 40px auto;
  text-align: left;
  width: 80%;
}
.invoice td {
  padding: 5px 0;
}
.invoice .invoice-items {
  width: 100%;
}
.invoice .invoice-items td {
  border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
  font-weight: 700;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
  body {
    padding: 0 !important;
  }

  h1, h2, h3, h4 {
    font-weight: 800 !important;
    margin: 20px 0 5px !important;
  }

  h1 {
    font-size: 22px !important;
  }

  h2 {
    font-size: 18px !important;
  }

  h3 {
    font-size: 16px !important;
  }

  .container {
    padding: 0 !important;
    width: 100% !important;
  }

  .content {
    padding: 0 !important;
  }

  .content-wrap {
    padding: 10px !important;
  }

  .invoice {
    width: 100% !important;
  }
}
</style>
</head>

<body itemscope itemtype="http://schema.org/EmailMessage">

<table class="body-wrap">
	<tr>
		<td></td>
		<td class="container" width="600">
			<div class="content">
				<table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction">
					<tr>
						<td class="content-wrap">
							<meta itemprop="name" content="Wave Snippet ready."/>
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td class="content-block">
										Hey there,
									</td>
								</tr>
								<tr>
									<td class="content-block">
										Your Wave Snippet is ready! Links expire in <b>seven days</b>.
									</td>
								</tr>
								<tr>
                  <td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler">
                    <a href="${videoURL[0]}" class="btn-primary" style="margin-right: 5px;" itemprop="url">Download MP4</a>
                    <a href="${gifURL[0]}" class="btn-primary" itemprop="url">Download GIF</a>
                  </td>
                </tr>
								<tr>
									<td style="padding-bottom: 5px;">
										Stay wavey,
									</td>
								</tr>
								<tr>
									<td class="content-block">
										&mdash; The Wave Snippets team
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<div class="footer">
					<table width="100%">
						<tr>
							<td class="aligncenter content-block">Follow <a href="https://twitter.com/marcuswood23">@marcuswood23</a> on Twitter.</td>
						</tr>
					</table>
				</div></div>
		</td>
		<td></td>
	</tr>
</table>

</body>
</html>
`,
      },
    })

    console.log('Emailed queued for delivery!')
  } catch (error) {
    console.log('Upload and send email err', error)

    reportError(error)
  }

  // TODO: Any cleanup needed for the functions like clearing out the temp dir?
  res.end()
  return
}
