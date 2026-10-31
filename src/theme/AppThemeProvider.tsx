import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';

import { useAppSettings } from '../settings/AppSettingsProvider';
import {
  AppTheme,
  createTheme,
  ThemeMode,
  ThemePreference,
} from './theme';

type AppThemeContextValue = {
  theme: AppTheme;
  // El modo que se está pintando (ya resuelto: nunca 'system').
  mode: ThemeMode;
  // Lo que eligió el usuario, para el selector de Perfil.
  preference: ThemePreference;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const {
    settings: { themeMode: preference },
  } = useAppSettings();
  // null en plataformas que no lo informan: ahí 'system' cae en claro.
  const systemScheme = useColorScheme();

  const mode: ThemeMode =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const currentTheme = useMemo(() => createTheme(mode), [mode]);

  const value = useMemo(
    () => ({ theme: currentTheme, mode, preference }),
    [currentTheme, mode, preference],
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
