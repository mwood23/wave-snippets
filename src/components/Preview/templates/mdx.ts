export const MDX = `
import React from "react"
import MDX from '@mdx-js/runtime'
import * as MDXDeckComponents from '@mdx-deck/gatsby-plugin'
// import * as Stuff from 'mdx-deck'
// import * as CodeSurferComponents from "code-surfer";

// console.log(MDXDeckComponents)

// Provide custom components for markdown elements
const components = {
  h1: props => <h1 style={{color: 'tomato'}} {...props} />,
  Demo: props => <h1>This is a demo component</h1>,
  MDXDeckComponents
  // ...CodeSurferComponents
}

// Provide variables that might be referenced by JSX
const scope = {
  some: 'value'
}
const mdx = \`

# Hello 👋

<Image height="300px" src={'https://source.unsplash.com/random'} />

You are using [MDX Deck](https://github.com/jxnblk/mdx-deck) and [Code Surfer](https://codesurfer.pomb.us)
\`


export const RenderMDX = () => (
  <MDX components={components} scope={scope}>
    {mdx}
  </MDX>
)
`
