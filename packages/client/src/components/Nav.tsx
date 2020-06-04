import React, { FC, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { useAuthDispatch, useAuthState } from '../context'
import { useOAuth } from '../hooks/useOAuth'
import {
  Box,
  Button,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from './core'
import { useCreateToast } from './Toast'

type NavProps = {}

export const Nav: FC<NavProps> = () => {
  const history = useHistory()
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, isLoading } = useAuthState()
  const { logout } = useAuthDispatch()
  const [
    loginWithGoogle,
    { loading: googleLoading, error: googleError },
  ] = useOAuth({ provider: 'google' })
  const [
    loginWithGithub,
    { loading: githubLoading, error: githubError },
  ] = useOAuth({ provider: 'github' })

  const toast = useCreateToast()

  useEffect(() => {
    if (googleError || githubError) {
      toast(googleError ?? githubError, { type: 'error' })
    }
  }, [googleError, githubError])

  return (
    <Box position="absolute" right="8" top="8" zIndex={3000}>
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'dark' ? 'sun' : 'moon'}
        mr="2"
        onClick={toggleColorMode}
        size="sm"
      />
      {/*
      // @ts-ignore */}
      <Button as={Link} mr="2" size="sm" to="/gallery">
        Gallery
      </Button>
      <Menu>
        {/*
        // @ts-ignore */}
        <MenuButton as={Button} mr="2" rightIcon="chevron-down" size="sm">
          New...
        </MenuButton>
        <MenuList placement="bottom-end">
          <MenuItem>Blank</MenuItem>
          <MenuItem>Create a Copy</MenuItem>
          <MenuItem>Mark as Draft</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuList>
      </Menu>
      {user ? (
        <Menu>
          {/*
            // @ts-ignore as coercion makes props messed up */}
          <MenuButton
            as={Button}
            // @ts-ignore
            isLoading={googleLoading || githubLoading}
            minWidth="175px"
            rightIcon="chevron-down"
            size="sm"
          >
            {user.photoURL && (
              <Image
                alt={user.displayName}
                mr="2"
                rounded="full"
                size="22px"
                src={user.photoURL}
              />
            )}
            {user.displayName}
          </MenuButton>
          <MenuList minWidth="125px" placement="bottom-end">
            <MenuItem
              onClick={() => {
                history.push('/my-snippets')
              }}
            >
              My Snippets
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout()
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Menu>
          {/*
        // @ts-ignore as coercion makes props messed up */}
          <MenuButton
            as={Button}
            // @ts-ignore
            isLoading={googleLoading || githubLoading || isLoading}
            minWidth="175px"
            rightIcon="chevron-down"
            size="sm"
          >
            Sign up/login
          </MenuButton>
          <MenuList minWidth="125px" placement="bottom-end">
            <MenuItem
              onClick={() => {
                loginWithGithub()
              }}
            >
              <Icon mr="2" name="github" /> Github
            </MenuItem>
            <MenuItem
              onClick={() => {
                loginWithGoogle()
              }}
            >
              <Icon mr="2" name="google" /> Google
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </Box>
  )
}
