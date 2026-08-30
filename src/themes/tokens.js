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
    'action-disabled': 'rgba(255, 255, 255, 0.3)',
    divider: 'rgba(255, 255, 255, 0.12)',
    'secondary-main': '#E60000',
    'secondary-button-active': '#90CAF9',
  },
}

export default tokens
