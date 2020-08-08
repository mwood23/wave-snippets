import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { animated, useSpring } from 'react-spring'

import { DEFAULT_APP_COLOR } from '../const'
import { backgroundColorToHex } from '../utils'
import { Box, Flex, FlexProps, Text } from './core'

type HeroProps = FlexProps & {
  showAboutSection?: false
}

const AnimFeTurbulence = animated('feTurbulence')
const AnimFeDisplacementMap = animated('feDisplacementMap')

export const Hero: FC<HeroProps> = ({ showAboutSection = true, ...rest }) => {
  const { freq, scale, transform, opacity } = useSpring({
    from: {
      scale: 10,
      opacity: 0,
      transform: 'scale(0.8)',
      freq: '0.0125, 0.0',
    },
    to: { scale: 150, opacity: 1, transform: 'scale(0.9)', freq: '0.0, 0.0' },
    config: { duration: 3000 },
  })

  return (
    <Flex alignItems="center" direction="column" {...rest}>
      <Link to="/">
        <animated.svg
          style={{ transform, opacity, margin: '1rem auto', cursor: 'pointer' }}
          viewBox="0 0 1068 446"
          width="220px"
        >
          <defs>
            <filter id="water">
              <AnimFeTurbulence
                baseFrequency={freq}
                numOctaves={1}
                result="TURB"
                seed="8"
                type="fractalNoise"
              />
              <AnimFeDisplacementMap
                in="SourceGraphic"
                in2="TURB"
                result="DISP"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          <g filter="url(#water)">
            <animated.path
              d="M289.456 438.398h-80.44l-24.603-205.262-5.776-62.085-3.851-49.837h-1.284c-5.99 68.42-10.197 113.189-12.622 134.307l-22.249 182.877H59.6883L0 7.6023h74.236L91.9927 173.163c5.4197 55.468 8.7003 102.631 9.8413 141.487h1.069c.428-22.244 3.994-66.591 10.697-133.04L133.71 7.6023h83.222L235.33 183.722c5.848 55.186 9.556 98.829 11.125 130.928h1.283c.571-16.613 1.783-40.687 3.637-72.222 2.14-30.972 4.208-54.061 6.205-69.265L276.834 7.6023h72.524L289.456 438.398zM574.761 438.398h-51.987l-14.547-57.017h-1.498c-9.841 24.496-20.181 41.39-31.021 50.681C465.011 441.354 451.391 446 434.846 446c-20.68 0-36.868-12.248-48.563-36.744-11.695-24.497-17.543-58.566-17.543-102.209 0-88.411 31.449-135.151 94.346-140.219l36.583-2.534v-5.913c0-35.478-8.914-53.216-26.742-53.216-15.689 0-35.87 10.558-60.544 31.676l-21.822-97.9849C416.091 12.952 448.182 0 486.833 0c27.954 0 49.562 13.7967 64.823 41.3902 15.403 27.5934 23.105 65.7458 23.105 114.4568v282.551zM445.543 301.557c0 26.467 7.131 39.701 21.394 39.701 9.128 0 16.901-5.632 23.319-16.894 6.418-11.263 9.627-26.186 9.627-44.769v-33.366l-17.329 1.267c-24.674 2.253-37.011 20.273-37.011 54.061zM718.824 306.203h1.284c0-12.671 1.212-27.031 3.637-43.08L762.467 7.6023h78.301L757.547 438.398h-74.45L599.876 7.6023h78.514l37.011 254.6757c0 .564.214 2.816.642 6.758.428 3.66.785 7.18 1.07 10.559 1.141 10.699 1.711 19.569 1.711 26.608zM999.54 169.784c-.142-20.836-3.066-37.448-8.771-49.837-5.705-12.389-13.335-18.583-22.891-18.583-9.413 0-17.044 5.772-22.891 17.316-5.705 11.263-9.057 28.297-10.055 51.104h64.608zM972.157 446c-36.37 0-64.609-19.006-84.719-57.017-20.11-38.575-30.165-93.621-30.165-165.138 0-71.518 9.27-126.7049 27.811-165.5609C903.626 19.428 929.797 0 963.599 0s59.621 17.0347 77.441 51.1042C1059.01 85.1736 1068 133.884 1068 197.237v65.886H933.434c.428 24.215 4.849 43.22 13.264 57.017 8.415 13.515 19.468 20.273 33.16 20.273 13.835 0 26.382-2.393 37.652-7.18 11.27-5.068 23.32-13.656 36.16-25.763v106.854c-11.41 11.826-23.47 19.991-36.16 24.496-12.55 4.787-27.668 7.18-45.353 7.18z"
              fill={backgroundColorToHex(DEFAULT_APP_COLOR)}
            />
          </g>
        </animated.svg>
      </Link>
      {showAboutSection && (
        <Box marginBottom="8">
          <Text
            fontSize={['md', 'lg', 'xl']}
            fontWeight="500"
            textAlign="center"
          >
            Create and share gorgeous animated snippets of your code with the
            world.
          </Text>
        </Box>
      )}
    </Flex>
  )
}
