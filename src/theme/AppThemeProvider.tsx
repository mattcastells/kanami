import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { useAppSettings } from '../settings/AppSettingsProvider';
import {
  AppTheme,
  createTheme,
  ThemeMode,
} from './theme';

type AppThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const {
    settings: { themeMode },
  } = useAppSettings();

  const currentTheme = useMemo(() => createTheme(themeMode), [themeMode]);

  const value = useMemo(
    () => ({
      theme: currentTheme,
      mode: themeMode,
    }),
    [currentTheme, themeMode],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }

  return context;
}
