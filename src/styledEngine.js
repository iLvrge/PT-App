
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux'
import { createTheme} from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from 'notistack';
import App from './components/App';
import themeMode from './themes/themeMode'
import ErrorBoundary from './components/common/ErrorBoundary'
import RouteErrorFallback from './components/common/RouteErrorFallback'
import OfflineBanner from './components/common/OfflineBanner'
import { TooltipProvider } from './ui/Tooltip'

export const StyledEngine = () => {

    const isDarkTheme = useSelector(state => state.ui.isDarkTheme);
    // Tailwind's dark: variant keys off this class; MUI keys off the same flag.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', Boolean(isDarkTheme))
    }, [ isDarkTheme ])

    const theme = useMemo(
        () =>  
        createTheme(isDarkTheme  ? themeMode.dark: themeMode.light),
        [isDarkTheme],
    )
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <TooltipProvider delayDuration={200}>
                <SnackbarProvider maxSnack={3}>
                    <CssBaseline />
                    <OfflineBanner />
                    {/* Last-resort boundary: catches anything thrown above the
                        per-route boundaries so the app never renders blank. */}
                    <ErrorBoundary fallback={(state) => <RouteErrorFallback {...state} />}>
                        <App />
                    </ErrorBoundary>
                </SnackbarProvider>
                </TooltipProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    )

}