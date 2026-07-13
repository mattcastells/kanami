import { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';

type FeedbackBannerProps = {
  status: 'idle' | 'correct' | 'incorrect';
  promptText?: string;
  correctText: string;
  selectedText?: string | null;
};

export function FeedbackBanner({
  status,
  promptText,
  correctText,
  selectedText,
}: FeedbackBannerProps) {
  const { theme: activeTheme } = useAppTheme();
  const successTone = activeTheme.colors.success;
  const errorTone = activeTheme.colors.error;

  const tone =
    status === 'correct'
      ? successTone
      : status === 'incorrect'
        ? errorTone
        : activeTheme.colors.lineStrong;

  const resolvedAnswerText = promptText ? `${promptText} - ${correctText}` : correctText;

  const message =
    status === 'correct'
      ? `Correcto: ${resolvedAnswerText}`
      : `Incorrecto: ${selectedText ?? '...'} -> ${resolvedAnswerText}`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'transparent',
          borderColor:
            status === 'idle'
              ? activeTheme.colors.line
              : hexToRgba(tone, 0.48),
        },
      ]}
    >
      {status === 'idle' ? null : (
        <>
          <MaterialCommunityIcons
            name={status === 'correct' ? 'check-circle-outline' : 'close-circle-outline'}
            size={16}
            color={tone}
          />
          <AutoFitFeedbackText color={activeTheme.colors.textPrimary}>
            {message}
          </AutoFitFeedbackText>
        </>
      )}
    </View>
  );
}

function AutoFitFeedbackText({
  children,
  color,
}: {
  children: string;
  color: string;
}) {
  const [availableWidth, setAvailableWidth] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const minimumScale = 0.52;
  const scale =
    availableWidth > 0 && measuredWidth > 0
      ? Math.max(minimumScale, Math.min(1, (availableWidth - 2) / measuredWidth))
      : 1;

  const handleWidthLayout = (
    nextWidth: number,
    setter: Dispatch<SetStateAction<number>>,
  ) => {
    const roundedWidth = Math.round(nextWidth);

    setter((currentWidth) =>
      currentWidth === roundedWidth ? currentWidth : roundedWidth,
    );
  };

  return (
    <View
      style={styles.textWrap}
      onLayout={(event) => handleWidthLayout(event.nativeEvent.layout.width, setAvailableWidth)}
    >
      <Text
        adjustsFontSizeToFit
        minimumFontScale={minimumScale}
        numberOfLines={1}
        style={[
          styles.text,
          styles.textVisible,
          {
            color,
            fontSize: 11 * scale,
            lineHeight: 14 * scale,
          },
        ]}
      >
        {children}
      </Text>

      <Text
        numberOfLines={1}
        pointerEvents="none"
        style={[styles.text, styles.textMeasure]}
        onLayout={(event) => handleWidthLayout(event.nativeEvent.layout.width, setMeasuredWidth)}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.typography.bodySmall.fontFamily,
    fontSize: 11,
    lineHeight: 14,
  },
  textVisible: {
    width: '100%',
  },
  textMeasure: {
    position: 'absolute',
    opacity: 0,
    left: 0,
    top: 0,
  },
});
