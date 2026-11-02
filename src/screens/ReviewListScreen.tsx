import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  ReviewGroupHeader,
  ReviewItemList,
  ReviewItemRow,
  RoundMarkButton,
} from '../components/review/ReviewItemRow';
import { AppText } from '../components/ui/AppText';
import { PillButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { getModeLabel } from '../features/progress/progressStore';
import { useWeak } from '../features/weak/WeakProvider';
import { RETIRE_STREAK, WeakItem } from '../features/weak/weakStore';
import { useAppTheme } from '../theme/AppThemeProvider';
import { FONTS, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

// Tu lista de repaso: todo lo que el Repaso puede preguntarte, agrupado por juego.
// Acá se quita lo que no te interesa, se fija lo que querés que no se vaya solo y se
// entra a agregar palabras o kanji a mano.

// "Quitar todos" pide un segundo toque: borra de una un grupo entero y no hay deshacer.
const CONFIRM_WINDOW_MS = 3000;
// Un prompt de hasta 3 caracteres entra en la cajita; uno más largo (una frase) va como título.
const GLYPH_MAX = 3;

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

function statusOf(item: WeakItem) {
  const base = item.misses > 0 ? `${item.misses} ${item.misses === 1 ? 'fallo' : 'fallos'}` : 'agregado';
  return !item.pinned && item.streak > 0 ? `${base} · ${item.streak}/${RETIRE_STREAK}` : base;
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
        glyph="復習"
        title="Tu lista"
        subtitle="Sale con dos aciertos seguidos, salvo lo fijado."
        rightSlot={
          <PillButton title="+ Agregar" tone="highlight" onPress={() => navigation.navigate('ReviewAdd')} />
        }
      />

      {groups.length === 0 ? (
        <AppText variant="body" color={activeTheme.colors.textSecondary} style={styles.empty}>
          Vacía. Lo que falles se anota solo.
        </AppText>
      ) : null}

      {groups.map((group) => {
        const confirming = confirmingMode === group.modeKey;
        return (
          <View key={group.modeKey} style={styles.group}>
            <ReviewGroupHeader
              title={getModeLabel(group.modeKey)}
              count={group.items.length}
              actionLabel={confirming ? '¿SEGURO? TOCÁ DE NUEVO' : 'QUITAR TODOS'}
              actionDanger={confirming}
              onAction={() => removeGroup(group)}
            />
            <ReviewItemList>
              {group.items.map((item, index) => {
                const short = item.prompt.length <= GLYPH_MAX;
                return (
                  <ReviewItemRow
                    key={item.key}
                    first={index === 0}
                    glyph={short ? item.prompt : undefined}
                    title={short ? item.answer : item.prompt}
                    subtitle={short ? statusOf(item) : `${item.answer} · ${statusOf(item)}`}
                  >
                    <PinPill pinned={item.pinned} onToggle={() => setPinned(item.key, !item.pinned)} />
                    <RoundMarkButton
                      kind="remove"
                      accessibilityLabel="Quitar de la lista"
                      onPress={() => removeItems([item.key])}
                    />
                  </ReviewItemRow>
                );
              })}
            </ReviewItemList>
          </View>
        );
      })}
    </ScreenBackground>
  );
}

// FIJAR / FIJADO: lo fijado no se retira con los dos aciertos.
function PinPill({ pinned, onToggle }: { pinned: boolean; onToggle: () => void }) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: pinned }}
      accessibilityLabel={pinned ? 'Desfijar' : 'Fijar'}
      onPress={onToggle}
      hitSlop={6}
      style={({ pressed }) => [
        styles.pin,
        pinned
          ? { backgroundColor: colors.highlight, borderColor: colors.line }
          : { backgroundColor: 'transparent', borderColor: colors.hair },
        pressed && styles.pressed,
      ]}
    >
      <AppText style={styles.pinText} color={pinned ? colors.onHighlight : colors.textMuted}>
        {pinned ? 'FIJADO' : 'FIJAR'}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: theme.spacing.md,
  },
  group: {
    marginBottom: theme.spacing.md,
  },
  pin: {
    borderWidth: 2,
    borderRadius: theme.radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pinText: {
    fontFamily: FONTS.black,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.7,
  },
  pressed: {
    opacity: 0.6,
  },
});
