import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

const createAppTheme = (isDarkMode) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#8C1D40', // ASU Maroon
      },
      secondary: {
        main: '#FFC627', // ASU Gold
      },
      background: {
        default: isDarkMode ? '#121212' : '#D9D9D9',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
        secondary: isDarkMode ? '#b3b3b3' : '#666666',
      },
    },
  });
};

export const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserThemePreference = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsDarkMode(userData.dark_mode || false);
      }
    } catch (error) {
      console.error('Failed to fetch user theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserThemePreference();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = createAppTheme(isDarkMode);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};