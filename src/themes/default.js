import tinycolor from 'tinycolor2'

const primary = '#536DFE'

const lightenRate = 7.5
const darkenRate = 15

export default {
  color: {
    spacing: 'black',
    background: '#222222',
    white: 'white',
    lightGray: '#bdbdbd',
    green: 'rgb(112, 168, 0 )'
  },
  palette: {
    mode: 'dark',
    primary: {
      main: primary,
      light: tinycolor(primary)
        .lighten(lightenRate)
        .toHexString(),
      dark: tinycolor(primary)
        .darken(darkenRate)
        .toHexString(),
    },
    background: {
      default: '#F6F7FF',
      light: '#F3F5FF',
      dark: '#222222'
    },
  }
}
