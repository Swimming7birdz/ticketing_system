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
  const [themeMode, setThemeMode] = useState('light'); // 'light', 'dark', or 'auto'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Check if we need to reload themes due to user change
  const checkAndReloadTheme = () => {
    const userId = Cookies.get('user_id');
    if (userId !== currentUserId) {
      setCurrentUserId(userId);
      fetchUserThemePreference();
    }
  };

  // Function to determine if it should be dark based on time
  const getAutoDarkMode = () => {
    const hour = new Date().getHours();
    // Dark mode from 6 PM (18:00) to 6 AM (6:00)
    return hour >= 18 || hour < 6;
  };

  // Function to update the effective dark mode based on theme mode
  const updateEffectiveDarkMode = (currentThemeMode = themeMode) => {
    if (currentThemeMode === 'auto') {
      setIsDarkMode(getAutoDarkMode());
    } else {
      setIsDarkMode(currentThemeMode === 'dark');
    }
  };

  const fetchUserThemePreference = async () => {
    const token = Cookies.get('token');
    const userId = Cookies.get('user_id');
    
    // Update current user ID
    setCurrentUserId(userId);
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // First check localStorage for user-specific theme_mode
      const savedThemeMode = userId ? localStorage.getItem(`theme_mode_${userId}`) : null;
      
      if (savedThemeMode && ['light', 'dark', 'auto'].includes(savedThemeMode)) {
        setThemeMode(savedThemeMode);
        updateEffectiveDarkMode(savedThemeMode);
      } else {
        // Fall back to backend dark_mode setting
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const userThemeMode = userData.dark_mode ? 'dark' : 'light';
          setThemeMode(userThemeMode);
          updateEffectiveDarkMode(userThemeMode);
          
          // Save to localStorage for future use
          if (userId) {
            localStorage.setItem(`theme_mode_${userId}`, userThemeMode);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAndReloadTheme();
  }, []);

  // Check for user changes on every render (will detect user switches immediately)
  useEffect(() => {
    checkAndReloadTheme();
  });

  // Listen for focus events to check when user switches back to tab
  useEffect(() => {
    const handleFocus = () => {
      checkAndReloadTheme();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Listen for custom user change events
  useEffect(() => {
    const handleUserChange = () => {
      checkAndReloadTheme();
    };

    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  // Auto theme checker - runs every minute when theme mode is 'auto'
  useEffect(() => {
    if (themeMode !== 'auto') return;

    const checkTime = () => {
      updateEffectiveDarkMode();
    };

    // Check immediately
    checkTime();

    // Check every minute
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, [themeMode]);

  const setTheme = async (newThemeMode) => {
    const token = Cookies.get('token');
    const userId = Cookies.get('user_id');
    
    setThemeMode(newThemeMode);
    updateEffectiveDarkMode(newThemeMode);
    
    // Save theme_mode to localStorage with user ID for user-specific storage
    if (userId) {
      localStorage.setItem(`theme_mode_${userId}`, newThemeMode);
    }
    
    // Save dark_mode to backend for compatibility
    if (!token) return;

    try {
      const profileResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userData.user_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...userData,
            dark_mode: newThemeMode === 'dark' // Update dark_mode for backward compatibility
          }),
        });
      }
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Legacy function for compatibility
  const toggleTheme = async () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    await setTheme(newMode);
  };

  const theme = createAppTheme(isDarkMode);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      themeMode, 
      setTheme, 
      toggleTheme, // Keep for backward compatibility
      theme 
    }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};