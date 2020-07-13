import { Form, Formik } from 'formik'
import React, { FC, useRef } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import { object, string } from 'yup'

import { useConvertKit } from '../hooks/useConvertKit'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  LinkProps,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorMode,
  useDisclosure,
} from './core'

type FooterProps = {}

const WavesFooterLink: FC<LinkProps> = ({ children, ...props }) => (
  <Link mr="4" {...props}>
    {children}
  </Link>
)

const InternalLink: FC<LinkProps & RouterLinkProps> = ({
  children,
  ...props
}) => (
  <WavesFooterLink
    // @ts-ignore
    as={RouterLink}
    {...props}
  >
    {children}
  </WavesFooterLink>
)

const NewsletterSignup = () => {
  const [subscribeToNewsletter] = useConvertKit()
  const emailInput = useRef(null)
  const { colorMode } = useColorMode()
  const color = { light: 'cyan.600', dark: 'cyan.400' }
  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <Popover
      usePortal
      closeOnBlur={false}
      initialFocusRef={emailInput}
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="top"
    >
      <PopoverTrigger>
        <Button
          backgroundColor="transparent"
          color={color[colorMode]}
          fontWeight="normal"
          lineHeight={1}
          mr="4"
          padding="0"
          variant="link"
        >
          Newsletter
        </Button>
      </PopoverTrigger>
      <PopoverContent p={5} zIndex={5000}>
        <PopoverCloseButton />
        <Formik
          initialValues={{
            email: '',
          }}
          onSubmit={async ({ email }, { setSubmitting }) => {
            setSubmitting(true)
            await subscribeToNewsletter(email)
            setSubmitting(false)

            onClose()
          }}
          validationSchema={object().shape({
            email: string()
              .required('Email is required.')
              .email('Must be a valid email.'),
          })}
        >
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            values,
            touched,
            errors,
            isValid,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormControl isInvalid={touched.email && !!errors.email} mb={3}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  aria-describedby="email-helper-text"
                  id="email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  ref={emailInput}
                  type="email"
                  value={values.email}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <Button
                isDisabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                type="submit"
              >
                Export
              </Button>
            </Form>
          )}
        </Formik>
      </PopoverContent>
    </Popover>
  )
}

export const Footer: FC<FooterProps> = () => (
  <Flex
    alignItems="center"
    flexDir="column"
    justifyContent="center"
    pb="8"
    pt="4"
    px="4"
  >
    <Flex alignItems="center" justifyContent="center" mb="2">
      <InternalLink to="/about">About</InternalLink>
      <WavesFooterLink
        isExternal
        href="mailto:hi@marcuswood.io?subject=Wave Snippets Feedback"
      >
        Feedback
      </WavesFooterLink>
      <NewsletterSignup />
      <InternalLink to="/terms-and-conditions">Terms</InternalLink>
      <InternalLink to="/privacy-policy">Privacy</InternalLink>
    </Flex>
    <Box>
      <Text>
        created by{' '}
        <WavesFooterLink isExternal href="https://www.marcuswood.io">
          Marcus Wood
        </WavesFooterLink>
      </Text>
    </Box>
  </Flex>
)
