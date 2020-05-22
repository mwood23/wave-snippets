import React, { FC } from 'react'
import { CodeMirror } from 'react-smooshpack'

import { Preview } from './components'

export const App: FC = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <CodeMirror style={{ width: '50%' }} />
      <Preview style={{ flex: 1 }} />
    </div>
  )
}
