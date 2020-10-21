import { captureException } from '@sentry/browser'
import { Form, Formik } from 'formik'
import React, { FC } from 'react'
import TimeAgo from 'react-timeago'
import { Box } from 'theme-ui'
import { Required } from 'utility-types'
import { boolean, object, string } from 'yup'

import { analytics } from '../config/firebase'
import { useAuthState, useSnippetState } from '../context'
import { useConvertKit } from '../hooks/useConvertKit'
import { head } from '../utils'
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IModal,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from './core'
import { useCreateToast } from './Toast'

type ExportModalProps = Required<
  Omit<IModal, 'children'>,
  'isOpen' | 'onClose'
> & {
  name?: string
}

const napkinCalculationOfEstimatedTime = ({
  numberOfSteps,
  fps = 20,
  restingDuration = 2,
}: {
  numberOfSteps: number
  fps?: number
  restingDuration?: number
}) => {
  const now = Date.now()

  const TIME_PER_STEP = 2.5
  const FRAMES_SHOT_PER_SECOND = 3
  const BUFFER_TIME_FOR_BOOTING_AND_SUCH = 15
  const FILE_CREATION = 25

  const duration = TIME_PER_STEP * numberOfSteps + restingDuration
  const numberOfFrames = duration * fps

  const initialRender = duration + 2
  const secondRender = numberOfFrames / FRAMES_SHOT_PER_SECOND

  const roughSeconds =
    BUFFER_TIME_FOR_BOOTING_AND_SUCH +
    FILE_CREATION +
    initialRender +
    secondRender

  return now + roughSeconds * 1000
}

export const ExportModal: FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { saveOrCreateSnippet, ...rest } = useSnippetState()
  const [subscribeToNewsletter] = useConvertKit()
  const { user, token } = useAuthState()

  const toast = useCreateToast()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <Formik
        initialValues={{
          email: user?.email ?? '',
          weeklyEmails: !user?.email,
          highQualityMode: false,
        }}
        isInitialValid={!!user?.email}
        onSubmit={async (
          { email, weeklyEmails, highQualityMode },
          { setSubmitting },
        ) => {
          setSubmitting(true)

          try {
            const snippetID = await saveOrCreateSnippet({
              force: true,
            })

            if (snippetID) {
              await fetch(
                `/api/queue/media-export?id=${snippetID}&emails=${email}&quality=${
                  highQualityMode ? 'high' : 'medium'
                }`,
                token
                  ? {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  : {},
              )
            }

            toast(
              <Box>
                <Text>
                  <span aria-label="wave" role="img">
                    🌊
                  </span>
                  &nbsp; Exporting your snippet now. Expect it in your inbox
                  around{' '}
                  <TimeAgo
                    date={napkinCalculationOfEstimatedTime({
                      numberOfSteps: rest.steps.length,
                    })}
                  />
                  .
                </Text>
              </Box>,
            )

            if (weeklyEmails) {
              await subscribeToNewsletter(head(email.split(','))!)
            }

            analytics.logEvent('snippet_exported', {
              language: rest.defaultLanguage,
              numberOfSteps: rest.steps.length,
              snippetTags: rest.tags,
            })

            // @ts-ignore Wants an event prop, but doesn't appear to need it
            onClose()
          } catch (error) {
            captureException(error)

            toast(
              <Box>
                <Text>Something went wrong. Please try again.</Text>
              </Box>,
            )
          }

          setSubmitting(false)
          return
        }}
        validationSchema={object().shape({
          email: string()
            .required('Email is required.')
            .email('Must be a valid email.'),
          weeklyEmails: boolean().required('Field is required'),
          highQualityMode: boolean(),
        })}
      >
        {({
          handleChange,
          handleBlur,
          touched,
          errors,
          values,
          isValid,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <ModalContent>
              <ModalHeader>Export Snippet</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isInvalid={touched.email && !!errors.email} mb={3}>
                  <FormLabel htmlFor="email">
                    What email should we send the export email to?
                  </FormLabel>
                  <Input
                    aria-describedby="email-helper-text"
                    id="email"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>

                  {!user && (
                    <FormHelperText id="email-helper-text">
                      We need your email because it takes 5-10 minutes to
                      process and create a high quality snippet. It&apos;s used
                      only to email you the snippet and send you weekly emails
                      if you opt in.
                      {/* TODO: Link to blog */}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={
                    touched.highQualityMode && !!errors.highQualityMode
                  }
                  mb={3}
                >
                  <Checkbox
                    isChecked={values.highQualityMode}
                    name="highQualityMode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variantColor="green"
                  >
                    High quality mode (exports MP4 file only)
                  </Checkbox>
                </FormControl>
                {!user && (
                  <FormControl
                    isInvalid={touched.weeklyEmails && !!errors.weeklyEmails}
                    mb={3}
                  >
                    <Checkbox
                      isChecked={values.weeklyEmails}
                      name="weeklyEmails"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variantColor="green"
                    >
                      Send me weekly emails of the waviest snippets
                    </Checkbox>
                  </FormControl>
                )}
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onClose} type="button" variant="ghost">
                  Close
                </Button>
                <Button
                  isDisabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Export
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
