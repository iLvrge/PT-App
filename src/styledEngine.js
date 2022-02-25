
import { useMemo } from 'react';
import { useSelector } from 'react-redux'
import { createTheme} from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';
import App from './components/App';

export const StyledEngine = () => {

    const light = {
        palette: {
            mode: "light",
        },
    };
    
    const dark = {
        palette: {
            mode: "dark",
        },
    };

    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);

    const theme = useMemo(
        () =>
        createTheme(isDarkTheme  ? dark: light),
        [isDarkTheme],
    )
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <CssBaseline />
                    <App />
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )

}