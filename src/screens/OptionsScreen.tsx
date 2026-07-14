import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Application from 'expo-application';

import appConfig from '../../app.json';
import { ProgressCard } from '../components/progress/ProgressCard';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { AppText } from '../components/ui/AppText';
import { downloadAndInstallRelease } from '../features/update/androidUpdater';
import {
  compareVersions,
  fetchLatestRelease,
  type AppRelease,
} from '../features/update/releaseClient';
import { useAppSettings } from '../settings/AppSettingsProvider';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';

type UpdateState =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'up-to-date'; currentVersion: string }
  | { kind: 'available'; currentVersion: string; release: AppRelease }
  | { kind: 'installing'; currentVersion: string; release: AppRelease }
  | { kind: 'error'; currentVersion: string; message: string };

export function OptionsScreen() {
  const { theme: activeTheme, mode } = useAppTheme();
  const {
    settings: { hapticsEnabled, geminiApiKey },
    setHapticsEnabled,
    setThemeMode,
    setGeminiApiKey,
  } = useAppSettings();
  const [keyDraft, setKeyDraft] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const keyDirty = keyDraft.trim() !== geminiApiKey;

  // Sincroniza el campo cuando la key llega del disco (carga async) o cambia.
  useEffect(() => {
    setKeyDraft(geminiApiKey);
  }, [geminiApiKey]);
  const installedVersion = useMemo(
    () => Application.nativeApplicationVersion ?? appConfig.expo.version,
    [],
  );
  const displayInstalledVersion = installedVersion.startsWith('v')
    ? installedVersion
    : `v${installedVersion}`;
  const [updateState, setUpdateState] = useState<UpdateState>({ kind: 'idle' });

  const checkForUpdates = async () => {
    if (Platform.OS !== 'android') {
      setUpdateState({
        kind: 'error',
        currentVersion: installedVersion,
        message: 'Este flujo de actualizacion esta disponible solo en Android.',
      });
      return;
    }

    setUpdateState({ kind: 'checking' });

    try {
      const release = await fetchLatestRelease();
      const hasUpdate = compareVersions(release.version, installedVersion) > 0;

      if (!hasUpdate) {
        setUpdateState({
          kind: 'up-to-date',
          currentVersion: installedVersion,
        });
        return;
      }

      setUpdateState({
        kind: 'installing',
        currentVersion: installedVersion,
        release,
      });
      await downloadAndInstallRelease(release);
      setUpdateState({
        kind: 'available',
        currentVersion: installedVersion,
        release,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo buscar ni descargar la actualizacion.';

      setUpdateState({
        kind: 'error',
        currentVersion: installedVersion,
        message,
      });
    }
  };

  const statusTone = getStatusTone(updateState.kind, activeTheme.colors);
  const latestVersion =
    updateState.kind === 'available' || updateState.kind === 'installing'
      ? updateState.release.version
      : null;
  const releasePageUrl =
    updateState.kind === 'available' || updateState.kind === 'installing'
      ? updateState.release.pageUrl
      : null;

  return (
    <ScreenBackground showBack={false} scrollable>
      <ScreenHeader title="Perfil" />

      <ProgressCard />

      <View style={styles.optionsSpacer} />

      <GlassCard contentStyle={styles.cardContent}>
        <View
          style={[
            styles.settingRow,
            {
              borderColor: activeTheme.colors.line,
              backgroundColor:
                Platform.OS === 'android'
                  ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.88)
                  : hexToRgba(activeTheme.colors.black, 0.14),
            },
          ]}
        >
          <View style={styles.settingCopy}>
            <AppText variant="bodyStrong">Feedback haptico</AppText>
          </View>

          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            thumbColor={'#F7F4EF'}
            trackColor={{
              false: activeTheme.colors.lineStrong,
              true: activeTheme.colors.accent,
            }}
            ios_backgroundColor={activeTheme.colors.lineStrong}
          />
        </View>

        <View
          style={[
            styles.settingRow,
            {
              borderColor: activeTheme.colors.line,
              backgroundColor:
                Platform.OS === 'android'
                  ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.88)
                  : hexToRgba(activeTheme.colors.black, 0.14),
            },
          ]}
        >
          <View style={styles.settingCopy}>
            <AppText variant="bodyStrong">Tema claro</AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              {mode === 'light' ? 'Papel' : 'Sumi'}
            </AppText>
          </View>

          <Switch
            value={mode === 'light'}
            onValueChange={(enabled) =>
              setThemeMode(enabled ? 'light' : 'dark')
            }
            thumbColor={'#F7F4EF'}
            trackColor={{
              false: activeTheme.colors.lineStrong,
              true: activeTheme.colors.accent,
            }}
            ios_backgroundColor={activeTheme.colors.lineStrong}
          />
        </View>

        {updateState.kind !== 'idle' ? (
          <View style={styles.section}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              Estado
            </AppText>
            <View
              style={[
                styles.statusPill,
                {
                  borderColor: hexToRgba(statusTone, 0.42),
                  backgroundColor: hexToRgba(statusTone, 0.12),
                },
              ]}
            >
              {updateState.kind === 'checking' || updateState.kind === 'installing' ? (
                <ActivityIndicator color={statusTone} size="small" />
              ) : null}
              <AppText variant="bodyStrong" color={statusTone} style={styles.statusText}>
                {getStatusLabel(updateState, installedVersion)}
              </AppText>
            </View>
          </View>
        ) : null}

        {latestVersion ? (
          <View style={styles.section}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              Ultima release encontrada
            </AppText>
            <AppText variant="bodyStrong">{latestVersion}</AppText>
          </View>
        ) : null}

        {updateState.kind === 'error' ? (
          <AppText variant="bodySmall" color={activeTheme.colors.error}>
            {updateState.message}
          </AppText>
        ) : null}

        <PrimaryButton
          title={
            updateState.kind === 'checking'
              ? 'BUSCANDO...'
              : updateState.kind === 'installing'
                ? 'DESCARGANDO...'
                : 'BUSCAR ACTUALIZACIONES'
          }
          onPress={checkForUpdates}
          disabled={
            updateState.kind === 'checking' || updateState.kind === 'installing'
          }
          style={styles.primaryAction}
        />

        {releasePageUrl ? (
          <PrimaryButton
            title="VER RELEASE EN GITHUB"
            variant="secondary"
            size="compact"
            onPress={() => {
              void Linking.openURL(releasePageUrl);
            }}
          />
        ) : null}
      </GlassCard>

      <View style={styles.optionsSpacer} />

      <GlassCard contentStyle={styles.cardContent}>
        <View style={styles.keyHeader}>
          <AppText variant="title">Kyary (IA)</AppText>
          <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
            Kyary usa Gemini. Poné tu propia API key (gratis) para usar el chat.
            Se guarda solo en este dispositivo.
          </AppText>
        </View>

        <View
          style={[
            styles.keyInputRow,
            {
              borderColor: activeTheme.colors.line,
              backgroundColor: hexToRgba(
                activeTheme.colors.backgroundSecondary,
                0.6,
              ),
            },
          ]}
        >
          <TextInput
            value={keyDraft}
            onChangeText={(value) => {
              setKeyDraft(value);
              setKeySaved(false);
            }}
            placeholder="Pegá tu API key de Gemini"
            placeholderTextColor={activeTheme.colors.textMuted}
            secureTextEntry={!showKey}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor={activeTheme.colors.accent}
            style={[styles.keyInput, { color: activeTheme.colors.textPrimary }]}
          />
          <Pressable onPress={() => setShowKey((current) => !current)} hitSlop={8}>
            <MaterialCommunityIcons
              name={showKey ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={activeTheme.colors.textMuted}
            />
          </Pressable>
        </View>

        {keySaved ? (
          <AppText variant="bodySmall" color={activeTheme.colors.success}>
            Key guardada. Ya podés hablar con Kyary.
          </AppText>
        ) : geminiApiKey ? (
          <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
            Hay una key guardada en este dispositivo.
          </AppText>
        ) : (
          <AppText variant="bodySmall" color={activeTheme.colors.warning}>
            Sin key, Kyary no puede responder.
          </AppText>
        )}

        <View style={styles.keyActions}>
          <PrimaryButton
            title="GUARDAR"
            size="compact"
            disabled={!keyDirty}
            onPress={() => {
              setGeminiApiKey(keyDraft.trim());
              setKeySaved(true);
            }}
            style={styles.keyActionFlex}
          />
          {geminiApiKey ? (
            <PrimaryButton
              title="BORRAR"
              variant="ghost"
              size="compact"
              onPress={() => {
                setGeminiApiKey('');
                setKeyDraft('');
                setKeySaved(false);
              }}
              style={styles.keyActionFlex}
            />
          ) : null}
        </View>

        <PrimaryButton
          title="CONSEGUIR UNA API KEY"
          variant="secondary"
          size="compact"
          onPress={() => {
            void Linking.openURL('https://aistudio.google.com/apikey');
          }}
        />
      </GlassCard>

      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textMuted}
        style={styles.installedVersion}
      >
        {displayInstalledVersion}
      </AppText>
    </ScreenBackground>
  );
}

function getStatusLabel(state: UpdateState, installedVersion: string) {
  switch (state.kind) {
    case 'checking':
      return 'Buscando release nueva...';
    case 'up-to-date':
      return `Ya estas en ${installedVersion}`;
    case 'available':
      return `APK ${state.release.version} lista para instalar`;
    case 'installing':
      return `Descargando ${state.release.version}...`;
    case 'error':
      return 'No se pudo actualizar';
    case 'idle':
    default:
      return '';
  }
}

function getStatusTone(
  kind: UpdateState['kind'],
  colors: typeof theme.colors,
) {
  switch (kind) {
    case 'error':
      return colors.error;
    case 'up-to-date':
      return colors.success;
    case 'available':
    case 'installing':
      return colors.accent;
    case 'checking':
      return colors.warning;
    case 'idle':
    default:
      return colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  cardContent: {
    gap: theme.spacing.md,
  },
  optionsSpacer: {
    height: theme.spacing.md,
  },
  settingRow: {
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  settingCopy: {
    flex: 1,
  },
  section: {
    gap: theme.spacing.xs,
  },
  statusPill: {
    minHeight: 44,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusText: {
    flexShrink: 1,
  },
  primaryAction: {
    marginTop: theme.spacing.xs,
  },
  installedVersion: {
    alignSelf: 'center',
    marginTop: theme.spacing.md,
  },
  keyHeader: {
    gap: theme.spacing.xxs,
  },
  keyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  keyInput: {
    flex: 1,
    fontFamily: 'ZenKakuGothicNew_400Regular',
    fontSize: 14,
    paddingVertical: 0,
    minHeight: 24,
  },
  keyActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  keyActionFlex: {
    flex: 1,
  },
});
