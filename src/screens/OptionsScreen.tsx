import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { RoundsPicker } from '../components/practice/RoundsPicker';
import { SelectChip } from '../components/practice/SelectChip';
import { ProgressCard } from '../components/progress/ProgressCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Segmented } from '../components/ui/InkBits';
import { InkSwitch } from '../components/ui/InkSwitch';
import { PalettePicker } from '../components/ui/PalettePicker';
import { SoundPicker } from '../components/ui/SoundPicker';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { AppText } from '../components/ui/AppText';
import {
  requestReminderPermission,
  syncDailyReminder,
} from '../features/notifications/reminders';
import { downloadAndInstallRelease } from '../features/update/androidUpdater';
import { getInstalledVersion } from '../features/update/installedVersion';
import {
  compareVersions,
  fetchLatestRelease,
  type AppRelease,
} from '../features/update/releaseClient';
import { useAppSettings } from '../settings/AppSettingsProvider';
import { KYARY_ENABLED } from '../features/flags';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme, ThemePreference } from '../theme/theme';

const REMINDER_HOURS = [8, 13, 18, 20, 21];

type UpdateState =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'up-to-date'; currentVersion: string }
  | { kind: 'available'; currentVersion: string; release: AppRelease }
  | { kind: 'installing'; currentVersion: string; release: AppRelease }
  | { kind: 'error'; currentVersion: string; message: string };

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

export function OptionsScreen() {
  const { theme: activeTheme, mode, preference, palette } = useAppTheme();
  const { colors } = activeTheme;
  // Separador entre filas de la lista de ajustes (no va en la primera).
  const rowDivider = { borderTopWidth: 2, borderTopColor: colors.hair };
  const {
    settings: { hapticsEnabled, answerSound, geminiApiKey, reminderEnabled, reminderHour },
    setHapticsEnabled,
    setAnswerSound,
    setThemeMode,
    setPalette,
    setGeminiApiKey,
    setReminderEnabled,
    setReminderHour,
  } = useAppSettings();
  const [reminderError, setReminderError] = useState<string | null>(null);

  const handleToggleReminder = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestReminderPermission();
      if (!granted) {
        setReminderError(
          'No se pudo activar. Habilitá las notificaciones en los ajustes del sistema.',
        );
        return;
      }
      setReminderError(null);
      setReminderEnabled(true);
      void syncDailyReminder(true, reminderHour);
    } else {
      setReminderEnabled(false);
      void syncDailyReminder(false, reminderHour);
    }
  };

  const handleSelectHour = (hour: number) => {
    setReminderHour(hour);
    if (reminderEnabled) {
      void syncDailyReminder(true, hour);
    }
  };
  const [keyDraft, setKeyDraft] = useState(geminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const keyDirty = keyDraft.trim() !== geminiApiKey;

  // Sincroniza el campo cuando la key llega del disco (carga async) o cambia.
  useEffect(() => {
    setKeyDraft(geminiApiKey);
  }, [geminiApiKey]);
  const installedVersion = useMemo(getInstalledVersion, []);
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

  const updating = updateState.kind === 'checking' || updateState.kind === 'installing';

  return (
    <ScreenBackground showBack={false} scrollable>
      <ScreenHeader glyph="私" title="Perfil" />

      <ProgressCard />

      <AppText variant="overline" color={colors.textSecondary} style={styles.sectionLabel}>
        Tema
      </AppText>
      <Segmented options={THEME_OPTIONS} value={preference} onChange={setThemeMode} />
      <AppText variant="bodySmall" color={colors.textSecondary} style={styles.themeNote}>
        {preference === 'system'
          ? `Como el teléfono (ahora ${mode === 'dark' ? 'oscuro' : 'claro'})`
          : mode === 'dark'
            ? 'Oscuro'
            : 'Claro'}
      </AppText>

      <View style={[styles.settings, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingCopy}>
            <AppText variant="bodyStrong">Feedback haptico</AppText>
          </View>
          <InkSwitch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
        </View>

        <View style={[styles.settingBlock, rowDivider]}>
          <View style={styles.settingRowInner}>
            <View style={styles.settingCopy}>
              <AppText variant="bodyStrong">Recordatorio diario</AppText>
              <AppText variant="bodySmall" color={colors.textSecondary}>
                {Platform.OS === 'web'
                  ? 'Solo en la app móvil'
                  : `Todos los días a las ${reminderHour}:00`}
              </AppText>
            </View>
            <InkSwitch
              value={reminderEnabled}
              onValueChange={(enabled) => void handleToggleReminder(enabled)}
              disabled={Platform.OS === 'web'}
            />
          </View>

          {reminderEnabled && Platform.OS !== 'web' ? (
            <View style={styles.chipRow}>
              {REMINDER_HOURS.map((hour) => (
                <SelectChip
                  key={hour}
                  label={`${hour}:00`}
                  selected={reminderHour === hour}
                  onPress={() => handleSelectHour(hour)}
                />
              ))}
            </View>
          ) : null}

          {reminderError ? (
            <AppText variant="bodySmall" color={colors.errorInk}>
              {reminderError}
            </AppText>
          ) : null}
        </View>

        <View style={[styles.settingBlock, rowDivider]}>
          <View style={styles.settingRowInner}>
            <View style={styles.settingCopy}>
              <AppText variant="bodyStrong">Versión</AppText>
              <AppText variant="bodySmall" color={colors.textSecondary}>
                {displayInstalledVersion}
              </AppText>
            </View>
            {updating ? <ActivityIndicator color={colors.primary} size="small" /> : null}
            <Pressable onPress={checkForUpdates} disabled={updating} hitSlop={8}>
              <AppText variant="labelSmall" color={updating ? colors.textMuted : colors.primary}>
                {updateState.kind === 'checking'
                  ? 'BUSCANDO...'
                  : updateState.kind === 'installing'
                    ? 'DESCARGANDO...'
                    : 'BUSCAR'}
              </AppText>
            </Pressable>
          </View>

          {/* Estados del updater como sub-líneas de la fila. */}
          {updateState.kind !== 'idle' ? (
            <AppText variant="bodySmall" color={statusTone}>
              {getStatusLabel(updateState, installedVersion)}
              {latestVersion ? ` · última release: ${latestVersion}` : ''}
            </AppText>
          ) : null}

          {updateState.kind === 'error' ? (
            <AppText variant="bodySmall" color={colors.errorInk}>
              {updateState.message}
            </AppText>
          ) : null}

          {releasePageUrl ? (
            <Pressable
              onPress={() => {
                void Linking.openURL(releasePageUrl);
              }}
              hitSlop={8}
            >
              <AppText variant="labelSmall" color={colors.primary}>
                VER RELEASE EN GITHUB
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Kyary está escondida (features/flags.ts): sin pestaña, la key no tiene uso. */}
      {KYARY_ENABLED ? (
        <>
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
                  backgroundColor: activeTheme.colors.background,
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
                selectionColor={activeTheme.colors.primary}
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
              <AppText variant="bodySmall" color={activeTheme.colors.successInk}>
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
        </>
      ) : null}

      {/* El mismo ajuste que eligen las pantallas de selección; acá rige para los juegos
          que no tienen una (Antónimos, Imágenes, Traducción). */}
      <View style={styles.picker}>
        <RoundsPicker />
      </View>

      <AppText variant="overline" color={colors.textSecondary} style={styles.sectionLabel}>
        Sonido al acertar
      </AppText>
      <View style={styles.picker}>
        <SoundPicker value={answerSound} onChange={setAnswerSound} />
      </View>

      <AppText variant="overline" color={colors.textSecondary} style={styles.sectionLabel}>
        Paleta
      </AppText>
      <View style={styles.picker}>
        <PalettePicker value={palette} onChange={setPalette} />
      </View>
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

// Texto chico de color: variantes *Ink; nunca el accent (es decorativo).
function getStatusTone(
  kind: UpdateState['kind'],
  colors: typeof theme.colors,
) {
  switch (kind) {
    case 'error':
      return colors.errorInk;
    case 'up-to-date':
      return colors.successInk;
    case 'available':
    case 'installing':
      return colors.primary;
    case 'checking':
      return colors.textSecondary;
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
  sectionLabel: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  themeNote: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  picker: {
    marginBottom: theme.spacing.xl,
  },
  settings: {
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  settingRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  settingBlock: {
    padding: 12,
    gap: theme.spacing.xs,
  },
  settingRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  settingCopy: {
    flex: 1,
  },
  keyHeader: {
    gap: theme.spacing.xxs,
  },
  keyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 2,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  keyInput: {
    flex: 1,
    fontFamily: FONTS.regular,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: theme.spacing.xxs,
  },
});
