import makeStyles from '@mui/styles/makeStyles';

// Shared with AddPeople.js in this directory. The `root` rule moved onto the
// Slacks component itself as utilities; only what AddPeople still uses is kept.
export default makeStyles(() => ({
    btnEmail: {
        padding: '0 5px',
        border: 0,
        position: 'absolute',
        textTransform: 'inherit'
    },
    dialogButton: {
        flex: '1 1 100%',
        display: 'flex',
        margin: '0 10px',
        '& .MuiInputLabel-shrink': {
          fontSize: 16
        }
    },
}))
