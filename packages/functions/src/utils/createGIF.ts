import { spawn } from 'child_process'

import ffmpeg_static from 'ffmpeg-static'

export const createGIF = ({
  frameDir,
  outputFile,
  fps = 20,
}: {
  outputFile: string
  frameDir: string
  /**
   * Frames per second.
   *
   * @default
   * 20
   */
  fps?: number
}) => {
  const ffmpegArgs = [
    '-y',
    '-pattern_type',
    'glob',
    '-i',
    `${frameDir}/*.png`,
    '-vf',
    `fps=${fps},scale=648:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    '-loop',
    '0',
    outputFile,
  ]

  const makePromise = () => {
    const convertProcess = spawn(ffmpeg_static, ffmpegArgs)
    convertProcess.stderr.setEncoding('utf8')
    convertProcess.stderr.on('data', function (data) {
      console.log(data)
    })

    return new Promise(function (resolve, reject) {
      convertProcess.on('close', function () {
        resolve()
      })
      convertProcess.on('error', function (err) {
        reject(err)
      })
      convertProcess.stdin.on('error', function (err) {
        reject(err)
      })
    })
  }

  return makePromise()
}
