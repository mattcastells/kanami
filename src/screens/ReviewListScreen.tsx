import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { AppText } from '../components/ui/AppText';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { getModeLabel } from '../features/progress/progressStore';
import { useWeak } from '../features/weak/WeakProvider';
import { RETIRE_STREAK, WeakItem } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Tu lista de repaso: todo lo que el Repaso puede preguntarte, agrupado por juego.
// Acá se quita lo que no te interesa, se fija lo que querés que no se vaya solo y se
// entra a agregar palabras o kanji a mano.

// "Quitar todos" pide un segundo toque: borra de una un grupo entero y no hay deshacer.
const CONFIRM_WINDOW_MS = 3000;

type Group = { modeKey: string; items: WeakItem[] };

function groupByMode(items: WeakItem[]): Group[] {
  const byMode = new Map<string, WeakItem[]>();
  items.forEach((item) => {
    byMode.set(item.modeKey, [...(byMode.get(item.modeKey) ?? []), item]);
  });
  return [...byMode.entries()]
    .map(([modeKey, groupItems]) => ({
      modeKey,
      // Lo más fallado arriba: es lo que más vale la pena mirar.
      items: [...groupItems].sort((a, b) => b.misses - a.misses),
    }))
    .sort((a, b) => b.items.length - a.items.length);
}

export function ReviewListScreen({ navigation }: RootStackScreenProps<'ReviewList'>) {
  const { theme: activeTheme } = useAppTheme();
  const { data, removeItems, setPinned } = useWeak();
  const groups = useMemo(() => groupByMode(Object.values(data.items)), [data]);
  const [confirmingMode, setConfirmingMode] = useState<string | null>(null);

  useEffect(() => {
    if (!confirmingMode) return undefined;
    const timeout = setTimeout(() => setConfirmingMode(null), CONFIRM_WINDOW_MS);
    return () => clearTimeout(timeout);
  }, [confirmingMode]);

  const removeGroup = (group: Group) => {
    if (confirmingMode !== group.modeKey) {
      setConfirmingMode(group.modeKey);
      return;
    }
    setConfirmingMode(null);
    removeItems(group.items.map((item) => item.key));
  };

  return (
    <ScreenBackground scrollable>
      <ScreenHeader
        eyebrow="復習 · Repaso"
        title="Tu lista"
        subtitle="Lo fallado sale solo después de dos aciertos seguidos. Lo fijado (📌) se queda hasta que lo quites."
      />

      <PrimaryButton
        title="AGREGAR PALABRAS O KANJI"
        variant="secondary"
        size="compact"
        onPress={() => navigation.navigate('ReviewAdd')}
        style={styles.addButton}
      />

      {groups.length === 0 ? (
        <AppText
          variant="body"
          color={activeTheme.colors.textSecondary}
          style={styles.empty}
        >
          Tu lista está vacía. Lo que falles en cualquier juego se anota acá solo, y también
          podés agregar palabras o kanji a mano.
        </AppText>
      ) : null}

      {groups.map((group) => {
        const confirming = confirmingMode === group.modeKey;
        return (
          <View
            key={group.modeKey}
            style={[
              styles.group,
              activeTheme.surfaces.card,
              { backgroundColor: activeTheme.colors.card },
            ]}
          >
            <View style={styles.groupHeader}>
              <AppText variant="bodyStrong" style={styles.groupTitle}>
                {getModeLabel(group.modeKey)}{' '}
                <AppText variant="label" color={activeTheme.colors.textMuted}>
                  {group.items.length}
                </AppText>
              </AppText>
              <Pressable onPress={() => removeGroup(group)} hitSlop={8}>
                <AppText
                  variant="label"
                  color={confirming ? activeTheme.colors.error : activeTheme.colors.textMuted}
                >
                  {confirming ? '¿SEGURO? TOCÁ DE NUEVO' : 'QUITAR TODOS'}
                </AppText>
              </Pressable>
            </View>

            {group.items.map((item) => (
              <View
                key={item.key}
                style={[styles.row, { borderTopColor: activeTheme.colors.line }]}
              >
                <View style={styles.rowText}>
                  <AppText variant="option" numberOfLines={1}>
                    {item.prompt}
                  </AppText>
                  <AppText
                    variant="bodySmall"
                    color={activeTheme.colors.textSecondary}
                    numberOfLines={1}
                  >
                    {item.answer}
                  </AppText>
                </View>

                <AppText
                  variant="label"
                  color={item.misses > 0 ? activeTheme.colors.error : activeTheme.colors.textMuted}
                >
                  {item.misses > 0
                    ? `${item.misses} ${item.misses === 1 ? 'fallo' : 'fallos'}`
                    : 'agregado'}
                  {!item.pinned && item.streak > 0
                    ? ` · ${item.streak}/${RETIRE_STREAK}`
                    : ''}
                </AppText>

                <Pressable
                  accessibilityRole="switch"
                  accessibilityState={{ checked: item.pinned }}
                  accessibilityLabel={item.pinned ? 'Desfijar' : 'Fijar'}
                  onPress={() => setPinned(item.key, !item.pinned)}
                  hitSlop={6}
                  style={({ pressed }) => [
                    styles.iconButton,
                    item.pinned && {
                      backgroundColor: hexToRgba(activeTheme.colors.accent, 0.12),
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.pinned ? 'pin' : 'pin-outline'}
                    size={18}
                    color={item.pinned ? activeTheme.colors.accent : activeTheme.colors.textMuted}
                  />
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Quitar de la lista"
                  onPress={() => removeItems([item.key])}
                  hitSlop={6}
                  style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    color={activeTheme.colors.textMuted}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        );
      })}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginBottom: theme.spacing.md,
  },
  empty: {
    marginTop: theme.spacing.md,
  },
  group: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  groupTitle: {
    flex: 1,
    minWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
