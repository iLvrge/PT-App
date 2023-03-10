import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
   
    root: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        '& .MuiFormControl-root': {
            width: 'calc(100% - 20px)',
            margin: '10px',
        },
    }
}))