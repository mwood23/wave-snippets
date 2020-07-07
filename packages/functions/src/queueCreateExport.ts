import axios, { AxiosRequestConfig } from 'axios'
import { Request, Response } from 'firebase-functions'

import { CLOUD_FUNCTIONS_URL } from './const'
import { createMediaValidationSchema } from './createMedia'

/**
 * Validates a user's input for exporting a snippet and then calls another cloud functions to render the export. We
 * do this because cloud functions can't send back a response and continue executing. Later on we may introduce
 * a message queue if this doesn't get the job done.
 */
export const queueCreateExport = async (req: Request, res: Response) => {
  console.log(req.url, req.headers.authorization)

  await createMediaValidationSchema
    .validate(req.query, { abortEarly: false })
    .catch(({ errors }) => {
      res.status(400).send(errors)

      throw new Error('createMedia validation error.')
    })

  const headers: AxiosRequestConfig['headers'] = {}

  if (req?.headers?.authorization) {
    headers.authorization = req.headers.authorization
  }

  // We're not waiting because we just want to trigger the cloud function
  axios(`${CLOUD_FUNCTIONS_URL}/export/create-media${req.url}`, {
    headers,
  })

  res.status(200).send({
    code: 'SUCCESS',
    msg: `Creating your snippet now.`,
  })
}