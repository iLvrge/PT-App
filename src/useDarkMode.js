import { useEffect, useState } from 'react';

export const useDarkMode = () => {
    const [isDarkTheme, setDarkTheme] = useState('dark');
    const [componentMounted, setComponentMounted] = useState(false);
  

    const setMode = mode => {
        window.localStorage.setItem('theme', mode)
        setDarkTheme(mode)
    } ;

    const toggleDarkTheme = () => {
        console.log("toggleDarkTheme=>isDarkTheme", isDarkTheme)
        if (isDarkTheme ===  'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    };

    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        if (localTheme) {
            setDarkTheme(localTheme);
        } else {
            setMode('dark');
        }
        setComponentMounted(true);
    }, []);

    return [isDarkTheme, toggleDarkTheme, componentMounted]
};