export const MDX = `
import React from "react"
import MDX from '@mdx-js/runtime'

// Provide custom components for markdown elements
const components = {
  h1: props => <h1 style={{color: 'tomato'}} {...props} />,
  Demo: props => <h1>This is a demo component</h1>
}

// Provide variables that might be referenced by JSX
const scope = {
  some: 'value'
}
const mdx = \`
# Hello, world!
<Demo />
\`


export const RenderMDX = () => (
  <MDX components={components} scope={scope}>
    {mdx}
  </MDX>
)
`
