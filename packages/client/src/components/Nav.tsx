import styled from '@emotion/styled/macro'
import React, { FC, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useAuthDispatch, useAuthState } from '../context'
import { useOAuth } from '../hooks/useOAuth'
import { TEMPLATES, TEMPLATES_DICT } from '../templates'
import {
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from './core'
import { useCreateToast } from './Toast'

type NavProps = {}

const StyledName = styled.span``

const StyledProfileMenuButton = styled(MenuButton)`
  @media (max-width: 985px) {
    min-width: auto;

    ${StyledName} {
      display: none;
    }
  }
`

export const Nav: FC<NavProps> = () => {
  const history = useHistory()
  const location = useLocation()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleError, githubError])

  return (
    <Box position="absolute" right="8" top="6" zIndex={1250}>
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'dark' ? 'sun' : 'moon'}
        mr="2"
        onClick={toggleColorMode}
        size="sm"
      />
      {/*
      // @ts-ignore */}
      {/* <Button as={Link} mr="2" size="sm" to="/gallery">
        Gallery
      </Button> */}
      {location.pathname === '/' && (
        <Menu>
          {/*
        // @ts-ignore */}
          <MenuButton as={Button} mr="2" rightIcon="chevron-down" size="sm">
            New...
          </MenuButton>
          <MenuList placement="bottom-end">
            {TEMPLATES.map((t) => {
              const foundTemplate = TEMPLATES_DICT[t]

              return (
                <MenuItem
                  key={t}
                  onClick={() => {
                    history.push(`/${t}`)
                  }}
                >
                  {foundTemplate.name}
                </MenuItem>
              )
            })}
          </MenuList>
        </Menu>
      )}
      {user ? (
        <Menu>
          {/*
            // @ts-ignore as coercion makes props messed up */}
          <StyledProfileMenuButton
            as={Button}
            // @ts-ignore
            isLoading={googleLoading || githubLoading}
            minWidth="175px"
            rightIcon="chevron-down"
            size="sm"
          >
            {user.photoURL && (
              <Avatar
                mr="2"
                name={user.displayName}
                rounded="full"
                size="xs"
                src={user.photoURL}
              />
            )}
            <StyledName>{user.displayName}</StyledName>
          </StyledProfileMenuButton>
          <MenuList minWidth="125px" placement="bottom-end">
            <MenuItem
              onClick={() => {
                history.push('/')
              }}
            >
              Home
            </MenuItem>
            {/* <MenuItem
              onClick={() => {
                history.push('/gallery')
              }}
            >
              Gallery
            </MenuItem> */}
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
