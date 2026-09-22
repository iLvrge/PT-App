import tokens from './tokens'

const build = (mode) => {
  const t = tokens[mode]
  return {
    palette: {
      mode,
      background: { default: t['bg-default'], paper: t['bg-paper'] },
      text: { primary: t['text-primary'], active: t['text-active'] },
      action: {
        disabled: t['action-disabled'],
        disabledBackground: t['action-disabled-background'],
      },
      divider: t.divider,
      secondary: { main: t['secondary-main'], buttonActive: t['secondary-button-active'] },
    },
    typography: { h6: { fontSize: '1.1rem' } },
  }
}

const themeMode = { light: build('light'), dark: build('dark') }

export default themeMode
