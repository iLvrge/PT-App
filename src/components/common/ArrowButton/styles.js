import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme) => ({
    arrowButton:{
        position: 'absolute',
        right: '-10px',
        top: '28px',
        zIndex: 99999,     
        '& .MuiFab-sizeSmall':{
          width:'21px',
          height:'22px',
          minHeight: 'auto'
        }
    },
    disable: {
        display: 'none'
    },
    btnColor: {
        color: '#f50057',
        backgroundColor: '#fff',
        '&:hover':{
            color: '#fff',
            backgroundColor: '#f50057',
        }
    }
}))
