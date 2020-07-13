import { Request, Response } from 'firebase-functions'

import { reportError } from './errors'
import { auth } from './store'

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * https://github.com/firebase/functions-samples/blob/Node-8/authorized-https-endpoint/functions/index.js
 */

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
export const isAuthenticatedRoute = async (
  req: Request,
  res: Response,
  next: any,
) => {
  // console.log('Check if request is authorized with Firebase ID token');

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.',
    )
    reportError(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
    )

    res.status(403).send('Unauthorized')

    return
  }

  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else if (req.cookies) {
    // console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session
  } else {
    // No cookie
    res.status(403).send('Unauthorized')
    return
  }

  try {
    const decodedIdToken = await auth.verifyIdToken(idToken)
    console.log('ID Token correctly decoded', decodedIdToken)

    res.locals.user = decodedIdToken
    next()
    return
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error)
    reportError(error)

    res.status(403).send('Unauthorized')
    return
  }
}

/**
 * Sometimes we want to add the user to the middleware if they exist without enforcing auth.
 * This lets us append special metadata to storage buckets or other spots while allowing the APIs
 * to be public
 */
export const addUserIfExists = async (
  req: Request,
  res: Response,
  next: any,
) => {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    next()
    return
  }

  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else if (req.cookies) {
    // console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session
  } else {
    // No cookie
    next()
    return
  }

  try {
    const decodedIdToken = await auth.verifyIdToken(idToken)
    console.log('ID Token correctly decoded', decodedIdToken)
    res.locals.user = decodedIdToken
    next()
    return
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error)
    reportError(error)

    // We still throw here because this smells weird if they're coming at us with a bombed out token.
    res.status(403).send('Unauthorized')
    return
  }
}
