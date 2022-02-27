const themeMode = {
    light: {
        palette: {
            mode: "light",
            background:{
                default: '#F7F9FC',
                paper: '#FFFFFF'
            },
            text: {
                primary: 'rgba(0, 0, 0, 0.87)'
            },
            divider: 'rgba(0, 0, 0, 0.12)'
        },
    },
    dark:{
        palette: {
            mode: "dark",
            background:{
                default: '#1d2025',
                paper: '#233044'
            },
            text: {
                primary: '#fff'
            },
            divider: 'rgba(255, 255, 255, 0.12)'
        },
    }
}


export default themeMode