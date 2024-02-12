const themeMode = {
    light: {
        palette: {
            mode: "light",
            background:{
                default: '#F7F9FC',
                paper: '#FFFFFF'
            },
            text: {
                primary: 'rgba(0, 0, 0, 0.87)',
                active: '#E60000'
            },
            action: {
                disabled: 'rgba(0, 0, 0, 0.26)'
            },
            divider: 'rgba(0, 0, 0, 0.12)',
            secondary: {
                main: '#E60000',
                buttonActive: '#90CAF9'
            }
        },
        typography: {
            h6: {
                fontSize: '1.1rem'
            }
        }
    }, 
    dark:{
        palette: {
            mode: "dark",
            background:{
                default: '#0B0C0E',
                paper: '#1D2025'
            },
            action: {
                disabled: 'rgba(255, 255, 255, 0.3)', 
                /* active: '#E60000' */
            },
            text: {
                primary: '#fff', 
                active: '#E60000'
            },
            divider: 'rgba(255, 255, 255, 0.12)',
            secondary: {
                main: '#E60000',
                buttonActive: '#90CAF9'
            }
        },
        typography: {
            h6: {
                fontSize: '1.1rem'
            }
        }
    }
}


export default themeMode