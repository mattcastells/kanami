import { StyleSheet, View } from 'react-native';

import { SESSION_ROUND_OPTIONS, useAppSettings } from '../../settings/AppSettingsProvider';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from '../ui/AppText';
import { SectionStep, Segmented } from '../ui/InkBits';

const OPTIONS = SESSION_ROUND_OPTIONS.map((value) => ({
  value,
  label: value === 0 ? 'Sin límite' : String(value),
}));

// Rondas por partida: 10 / 20 / 30 / sin límite. Es UN ajuste para todos los juegos
// (persistido): elegirlo acá lo cambia también en los demás, y en Perfil.
// Con `step` es un paso numerado de la pantalla de selección ("③ Rondas"); sin él (Perfil),
// una etiqueta de sección.
export function RoundsPicker({ step }: { step?: number }) {
  const { theme: activeTheme } = useAppTheme();
  const {
    settings: { sessionRounds },
    setSessionRounds,
  } = useAppSettings();

  return (
    <View>
      {step ? (
        <SectionStep n={step}>Rondas</SectionStep>
      ) : (
        <AppText variant="overline" color={activeTheme.colors.textSecondary} style={styles.label}>
          Rondas
        </AppText>
      )}
      <Segmented options={OPTIONS} value={sessionRounds} onChange={setSessionRounds} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
  },
});
