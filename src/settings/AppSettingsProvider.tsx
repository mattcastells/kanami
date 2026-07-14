import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { File, Paths } from 'expo-file-system';

import { ThemeMode } from '../theme/theme';

type AppSettings = {
  hapticsEnabled: boolean;
  themeMode: ThemeMode;
  // API key propia de Gemini (BYOK). Si está vacía, Kyary usa la embebida en el bundle.
  geminiApiKey: string;
};

type AppSettingsContextValue = {
  settings: AppSettings;
  setHapticsEnabled: (enabled: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setGeminiApiKey: (key: string) => void;
};

const DEFAULT_SETTINGS: AppSettings = {
  hapticsEnabled: false,
  themeMode: 'light',
  geminiApiKey: '',
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  // True once the user changes a setting. Guards against the load-vs-write race
  // and marks which state changes are worth persisting.
  const userTouchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const settingsFile = getSettingsFile();

        if (!settingsFile.exists) {
          return;
        }

        const fileContents = await settingsFile.text();
        const parsed = JSON.parse(fileContents);

        // If the user already toggled something while we were reading the file,
        // don't clobber their choice with the stale on-disk value.
        if (!cancelled && !userTouchedRef.current) {
          setSettings(normalizeSettings(parsed));
        }
      } catch {
        // Keep the in-memory defaults on any read/parse failure.
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist only user-initiated changes; never the default or the value we just
  // loaded from disk. Runs outside the setState updater so updaters stay pure.
  useEffect(() => {
    if (!userTouchedRef.current) {
      return;
    }

    void persistSettings(settings);
  }, [settings]);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    userTouchedRef.current = true;
    setSettings((currentSettings) => ({
      ...currentSettings,
      hapticsEnabled: enabled,
    }));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    userTouchedRef.current = true;
    setSettings((currentSettings) => ({
      ...currentSettings,
      themeMode: mode,
    }));
  }, []);

  const setGeminiApiKey = useCallback((key: string) => {
    userTouchedRef.current = true;
    setSettings((currentSettings) => ({
      ...currentSettings,
      geminiApiKey: key,
    }));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setHapticsEnabled,
      setThemeMode,
      setGeminiApiKey,
    }),
    [setGeminiApiKey, setHapticsEnabled, setThemeMode, settings],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return context;
}

function getSettingsFile() {
  return new File(Paths.document, 'app-settings.json');
}

function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SETTINGS;
  }

  const candidate = value as Partial<AppSettings>;

  const record = candidate as Record<string, unknown>;

  return {
    hapticsEnabled: candidate.hapticsEnabled === true,
    themeMode: record.themeMode === 'dark' ? 'dark' : 'light',
    geminiApiKey:
      typeof record.geminiApiKey === 'string' ? record.geminiApiKey : '',
  };
}

async function persistSettings(settings: AppSettings) {
  try {
    const settingsFile = getSettingsFile();
    settingsFile.create({ intermediates: true, overwrite: true });
    settingsFile.write(JSON.stringify(settings), { encoding: 'utf8' });
  } catch {
    // Ignore persistence failures and keep the in-memory setting.
  }
}
