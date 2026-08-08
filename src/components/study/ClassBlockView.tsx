import { StyleSheet, View } from 'react-native';

import { AppText } from '../ui/AppText';
import { SpeakButton } from '../ui/SpeakButton';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { ClassBlock } from '../../types/classNotes';

// Detecta la tabla Japonés/Romaji/Español, que es la más común en los apuntes y la
// que conviene mostrar apilada (con botón de audio) en vez de como grilla.
const JP_HEADERS = ['japonés', 'romaji', 'español'];

function isJapaneseTable(headers: string[]): boolean {
  return (
    headers.length === 3 &&
    headers.every((header, index) => header.trim().toLowerCase() === JP_HEADERS[index])
  );
}

// Una línea de cita puede venir como "japonés — español" o "japonés → respuesta".
// Solo separamos por el guion largo, que es el que usamos como traducción.
function splitQuoteLine(line: string): { main: string; translation?: string } {
  const separator = line.indexOf(' — ');
  if (separator === -1) return { main: line };
  return {
    main: line.slice(0, separator).trim(),
    translation: line.slice(separator + 3).trim(),
  };
}

// Las estructuras gramaticales usan placeholders ("[lugar] へ いきます"). No son
// oraciones reales: leerlas en voz alta pronunciaría los corchetes.
function isTemplateLine(line: string): boolean {
  return line.includes('[') || line.includes('］') || line.includes('［');
}

function NoteBlock({ tone, text }: { tone: string; text: string }) {
  const { theme: activeTheme } = useAppTheme();
  // ⚠️ es una trampa (error), 💡 y 📝 son informativos (accent).
  const tint = tone === '⚠️' ? activeTheme.colors.error : activeTheme.colors.accent;

  return (
    <View
      style={[
        styles.note,
        { borderLeftColor: tint, backgroundColor: hexToRgba(tint, 0.06) },
      ]}
    >
      <AppText variant="bodySmall">
        {tone} {text}
      </AppText>
    </View>
  );
}

function JapaneseTable({ rows }: { rows: string[][] }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.table,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
      ]}
    >
      {rows.map((row, index) => {
        const [jp = '', romaji = '', es = ''] = row;
        return (
          <View
            key={`${jp}-${index}`}
            style={[
              styles.jpRow,
              index > 0 && { borderTopWidth: 1, borderTopColor: activeTheme.colors.line },
            ]}
          >
            <View style={styles.jpRowText}>
              <AppText variant="title" style={styles.jpText}>
                {jp}
              </AppText>
              {romaji ? (
                <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                  {romaji}
                </AppText>
              ) : null}
              {es ? (
                <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                  {es}
                </AppText>
              ) : null}
            </View>
            {jp ? <SpeakButton text={jp} size={30} iconSize={16} /> : null}
          </View>
        );
      })}
    </View>
  );
}

function GridTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.table,
        {
          borderColor: activeTheme.colors.line,
          backgroundColor: activeTheme.colors.backgroundSecondary,
        },
      ]}
    >
      <View
        style={[
          styles.gridRow,
          {
            borderBottomWidth: 1,
            borderBottomColor: activeTheme.colors.line,
            backgroundColor: hexToRgba(activeTheme.colors.textPrimary, 0.03),
          },
        ]}
      >
        {headers.map((header, index) => (
          <View key={`${header}-${index}`} style={styles.gridCell}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              {header}
            </AppText>
          </View>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.gridRow,
            rowIndex > 0 && { borderTopWidth: 1, borderTopColor: activeTheme.colors.line },
          ]}
        >
          {row.map((cell, cellIndex) => (
            <View key={cellIndex} style={styles.gridCell}>
              <AppText
                variant="bodySmall"
                color={cellIndex === 0 ? undefined : activeTheme.colors.textSecondary}
              >
                {cell}
              </AppText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function ClassBlockView({ block }: { block: ClassBlock }) {
  const { theme: activeTheme } = useAppTheme();

  switch (block.kind) {
    case 'subheading':
      return (
        <AppText variant="bodyStrong" style={styles.subheading}>
          {block.text}
        </AppText>
      );

    case 'text':
      return (
        <AppText variant="body" style={styles.paragraph}>
          {block.text}
        </AppText>
      );

    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <AppText variant="body" color={activeTheme.colors.accent}>
                ·
              </AppText>
              <AppText variant="body" style={styles.listItemText}>
                {item}
              </AppText>
            </View>
          ))}
        </View>
      );

    case 'quote':
      return (
        <View style={[styles.quote, { borderLeftColor: activeTheme.colors.accent }]}>
          {block.lines.map((line, index) => {
            const { main, translation } = splitQuoteLine(line);
            return (
              <View key={index} style={styles.quoteLine}>
                <View style={styles.quoteLineText}>
                  <AppText variant="bodyStrong">{main}</AppText>
                  {translation ? (
                    <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                      {translation}
                    </AppText>
                  ) : null}
                </View>
                {isTemplateLine(main) ? null : (
                  <SpeakButton text={main} size={28} iconSize={15} />
                )}
              </View>
            );
          })}
        </View>
      );

    case 'note':
      return <NoteBlock tone={block.tone} text={block.text} />;

    case 'table':
      return isJapaneseTable(block.headers) ? (
        <JapaneseTable rows={block.rows} />
      ) : (
        <GridTable headers={block.headers} rows={block.rows} />
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  subheading: {
    marginTop: theme.spacing.sm,
  },
  paragraph: {
    lineHeight: 24,
  },
  list: {
    gap: theme.spacing.xxs,
  },
  listItem: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    alignItems: 'flex-start',
  },
  listItemText: {
    flex: 1,
    minWidth: 0,
  },
  quote: {
    borderLeftWidth: 2,
    paddingLeft: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  quoteLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  quoteLineText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  note: {
    borderLeftWidth: 2,
    borderRadius: theme.radii.sm,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  table: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  },
  jpRow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  jpRowText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  jpText: {
    fontSize: 16,
    lineHeight: 24,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  gridCell: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    justifyContent: 'center',
  },
});
