import { lighten, alpha } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
  childrenTable: {
    '& .MuiToolbar-regular': {
      height: 40,
      minHeight: 0,
    },
    '& [class*="makeStyles-search-"]': {
      display: 'none',
    },
  },
}))