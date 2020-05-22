import React, { FC } from 'react'
import {
  SandpackProvider as CoreSandpackProvider,
  SandpackConsumer,
} from 'react-smooshpack'
import { Props as SandpackProviderProps } from 'react-smooshpack/dist/types/components/SandpackProvider/SandpackProvider'

import { APP_DEPENDENCIES, BUNDLER_URL } from '../../const'
import { PREVIEW_FILES } from '../Preview'

const Poo: any = () => {
  return (
    <SandpackConsumer>
      {(sandpack) => {
        sandpack.openFile('/mdx.js')
        return <div>hello</div>
      }}
    </SandpackConsumer>
  )
}

export const SandpackProvider: FC<Partial<SandpackProviderProps>> = ({
  children,
  ...rest
}) => {
  return (
    <CoreSandpackProvider
      bundlerURL={BUNDLER_URL}
      dependencies={APP_DEPENDENCIES}
      entry="/index.js"
      files={PREVIEW_FILES}
      showOpenInCodeSandbox={false}
      template="create-react-app"
      {...rest}
    >
      <Poo />
      {children}
    </CoreSandpackProvider>
  )
}
