import { theme } from '@chakra-ui/core'

// Let's say you want to add custom colors
export const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
}
