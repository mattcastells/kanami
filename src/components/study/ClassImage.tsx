import { useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { CLASS_IMAGES } from '../../data/classImages.generated';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

// Relación de aspecto por defecto cuando el asset no reporta medidas (raro, pero
// evita que la imagen colapse a 0 de alto).
const FALLBACK_RATIO = 4 / 3;

export function ClassImage({ source, alt }: { source: string; alt: string }) {
  const { theme: activeTheme } = useAppTheme();
  const [zoomed, setZoomed] = useState(false);

  const asset = CLASS_IMAGES[source];

  const aspectRatio = useMemo(() => {
    if (!asset) return FALLBACK_RATIO;
    const resolved = Image.resolveAssetSource(asset);
    if (!resolved?.width || !resolved?.height) return FALLBACK_RATIO;
    return resolved.width / resolved.height;
  }, [asset]);

  // El generador valida que el archivo exista, así que llegar acá sin asset solo
  // pasa si alguien editó el .generated a mano. Mejor un aviso que un hueco mudo.
  if (!asset) {
    return (
      <View
        style={[
          styles.missing,
          { borderColor: activeTheme.colors.line },
        ]}
      >
        <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
          Falta la imagen «{source}».
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setZoomed(true)}
        style={({ pressed }) => [
          styles.frame,
          {
            borderColor: activeTheme.colors.line,
            backgroundColor: activeTheme.colors.backgroundSecondary,
          },
          pressed && styles.pressed,
        ]}
      >
        <Image
          source={asset}
          accessibilityLabel={alt || undefined}
          resizeMode="contain"
          style={[styles.image, { aspectRatio }]}
        />
        <View
          style={[
            styles.zoomBadge,
            { backgroundColor: hexToRgba(activeTheme.colors.black, 0.45) },
          ]}
        >
          <MaterialCommunityIcons
            name="magnify-plus-outline"
            size={14}
            color={activeTheme.colors.white}
          />
        </View>
      </Pressable>

      {alt ? (
        <AppText
          variant="bodySmall"
          color={activeTheme.colors.textMuted}
          style={styles.caption}
        >
          {alt}
        </AppText>
      ) : null}

      <Modal
        visible={zoomed}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomed(false)}
      >
        <Pressable
          onPress={() => setZoomed(false)}
          style={[
            styles.backdrop,
            { backgroundColor: hexToRgba(activeTheme.colors.black, 0.92) },
          ]}
        >
          <Image
            source={asset}
            accessibilityLabel={alt || undefined}
            resizeMode="contain"
            style={styles.zoomImage}
          />
          {alt ? (
            <AppText
              variant="bodySmall"
              // El fondo del zoom es negro en ambos temas, así que el epígrafe se lee
              // del token `white` y no de textPrimary (que en light sería tinta sobre negro).
              color={hexToRgba(activeTheme.colors.white, 0.85)}
              style={styles.zoomCaption}
            >
              {alt}
            </AppText>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.xxs,
  },
  frame: {
    borderWidth: 1,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  zoomBadge: {
    position: 'absolute',
    right: theme.spacing.xs,
    bottom: theme.spacing.xs,
    width: 26,
    height: 26,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    lineHeight: 18,
  },
  missing: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  zoomImage: {
    width: '100%',
    height: '80%',
  },
  zoomCaption: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
