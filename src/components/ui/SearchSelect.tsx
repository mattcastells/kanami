import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { FONTS, SIZES, theme } from '../../theme/theme';
import { AppText } from './AppText';

// Select en el que se puede escribir para filtrar. Cerrado muestra lo elegido; al tocarlo
// se vacía para tipear y despliega debajo las opciones que coinciden (sin importar
// tildes ni mayúsculas). Enter elige la primera. Reemplaza a las grillas de pastillas
// cuando las opciones son muchas.

export type SearchSelectOption<T extends string> = { value: T; label: string; count?: number };

type SearchSelectProps<T extends string> = {
  options: SearchSelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
};

// Cuántas filas se ven antes de scrollear la lista.
const VISIBLE_ROWS = 6;
const ROW_HEIGHT = 44;

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function SearchSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Buscá…',
}: SearchSelectProps<T>) {
  const { theme: activeTheme } = useAppTheme();
  const { colors } = activeTheme;
  const inputRef = useRef<TextInput>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = options.find((option) => option.value === value);
  const needle = normalize(query);
  const matches = needle ? options.filter((option) => normalize(option.label).includes(needle)) : options;

  const close = () => {
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const pick = (option: SearchSelectOption<T>) => {
    onChange(option.value);
    close();
  };

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <View>
      <View
        style={[
          styles.field,
          { borderColor: open ? colors.primary : colors.line, backgroundColor: colors.card },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={open ? query : selected?.label ?? ''}
          onChangeText={setQuery}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onSubmitEditing={() => {
            if (matches[0]) pick(matches[0]);
          }}
          placeholder={open ? selected?.label ?? placeholder : placeholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          style={[styles.input, { color: colors.textPrimary }]}
        />
        {!open && selected?.count !== undefined ? (
          <AppText variant="caption" color={colors.textMuted}>
            {selected.count}
          </AppText>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={open ? 'Cerrar la lista' : 'Abrir la lista'}
          onPress={toggle}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      {open ? (
        <View style={[styles.list, activeTheme.surfaces.outlined, { backgroundColor: colors.card }]}>
          {matches.length === 0 ? (
            <AppText variant="body" color={colors.textSecondary} style={styles.empty}>
              Nada con «{query.trim()}».
            </AppText>
          ) : (
            <ScrollView
              style={{ maxHeight: ROW_HEIGHT * VISIBLE_ROWS }}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {matches.map((option, index) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => pick(option)}
                    style={({ pressed }) => [
                      styles.row,
                      index > 0 ? { borderTopWidth: 2, borderTopColor: colors.hair } : null,
                      active ? { backgroundColor: colors.highlight } : null,
                      pressed ? { backgroundColor: colors.surface2 } : null,
                    ]}
                  >
                    <AppText
                      variant="bodyStrong"
                      numberOfLines={1}
                      color={active ? colors.onHighlight : colors.textPrimary}
                      style={styles.rowLabel}
                    >
                      {option.label}
                    </AppText>
                    {option.count !== undefined ? (
                      <AppText variant="caption" color={active ? colors.onHighlight : colors.textMuted}>
                        {option.count}
                      </AppText>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: SIZES.button,
    borderWidth: 2,
    borderRadius: theme.radii.md,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  input: {
    flex: 1,
    minWidth: 0,
    // Sin anillo de foco del navegador: el foco lo marca el borde ruri del campo.
    outlineStyle: 'solid',
    outlineWidth: 0,
    outlineColor: 'transparent',
    fontFamily: FONTS.bold,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 0,
    minHeight: 36,
  },
  list: {
    marginTop: theme.spacing.xxs,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  row: {
    minHeight: ROW_HEIGHT,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rowLabel: {
    flex: 1,
  },
  empty: {
    padding: 14,
  },
});
