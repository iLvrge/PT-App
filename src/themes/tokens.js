/**
 * The single source of truth for colour.
 *
 * MUI reads this through themeMode.js; Tailwind reads it through the CSS custom
 * properties generated from this file by the themeTokens plugin in
 * vite.config.js. Change a value here and both systems follow, so the two can
 * never drift apart during the MUI -> Tailwind migration.
 */
const tokens = {
  light: {
    'bg-default': '#F7F9FC',
    'bg-paper': '#FFFFFF',
    'text-primary': 'rgba(0, 0, 0, 0.87)',
    'text-active': '#E60000',
    // MUI's own defaults; themeMode never defined these, so this is what the
    // components have always rendered.
    'text-disabled': 'rgba(0, 0, 0, 0.38)',
    'muted': 'rgba(0, 0, 0, 0.3)',
    'text-secondary': 'rgba(0, 0, 0, 0.6)',
    'action-hover': 'rgba(0, 0, 0, 0.04)',
    'action-active': 'rgba(0, 0, 0, 0.54)',
    'action-disabled': 'rgba(0, 0, 0, 0.26)',
    divider: 'rgba(0, 0, 0, 0.12)',
    'secondary-main': '#E60000',
    'secondary-button-active': '#90CAF9',
  },
  dark: {
    'bg-default': '#0B0C0E',
    'bg-paper': '#1D2025',
    'text-primary': '#ffffff',
    'text-active': '#E60000',
    'text-disabled': 'rgba(255, 255, 255, 0.5)',
    'muted': 'rgba(255, 255, 255, 0.3)',
    'text-secondary': 'rgba(255, 255, 255, 0.7)',
    'action-hover': 'rgba(255, 255, 255, 0.08)',
    'action-active': '#ffffff',
    'action-disabled': 'rgba(255, 255, 255, 0.3)',
    divider: 'rgba(255, 255, 255, 0.12)',
    'secondary-main': '#E60000',
    'secondary-button-active': '#90CAF9',
  },
}

export default tokens
