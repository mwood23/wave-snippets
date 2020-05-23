import { Button, Flex } from '@chakra-ui/core'
import React, { FC } from 'react'

import { useBuilderDispatch, useBuilderState } from '../../context'

type ToolbarProps = {
  onRenderGIFClicked: any
}

// {
//   /* <Button
// onClick={async () => {

//   const images = await Promise.all(
//     data.map((myBlob) => {
//       return new Promise(function (resolved) {
//         const i = new Image()
//         i.onload = function () {
//           // wait for the onload to get the width and height
//           resolved(i)
//         }

//         i.src = myBlob
//       })
//     }),
//   )

//   const gif = new GIF({
//     workers: 2,
//     quality: 5,
//     workerScript: '/gif.worker.js',
//     delay: 0,
//   })

//   console.log('FINAL IMAGES', { images })
//   images.forEach((img) => {
//     return gif.addFrame(img, { delay: 200 })
//   })

//   gif.on('finished', function (blob: any) {
//     console.log('finish')
//     window.open(URL.createObjectURL(blob))
//   })

//   gif.render()
// }}
// >
// download
// </Button>
// <Button
// onClick={() => {
//   return captureImages()
// }}
// >
// do it
// </Button> */
// }
export const Toolbar: FC<ToolbarProps> = ({ onRenderGIFClicked }) => {
  const { teleport, pause } = useBuilderState()
  const dispatch = useBuilderDispatch()

  return (
    <Flex>
      <Button>Download</Button>
      <Button
        onClick={() => {
          return dispatch({ type: 'setTeleport', teleport: !teleport })
        }}
      >
        Teleport
      </Button>
      <Button
        onClick={() => {
          return dispatch({ type: 'setPause', pause: !pause })
        }}
      >
        Pause
      </Button>
      <Button onClick={onRenderGIFClicked}>Download</Button>
    </Flex>
  )
}
