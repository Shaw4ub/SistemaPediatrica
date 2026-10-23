import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

/**
 * Avatar circular con iniciales y color estable según el nombre.
 */
const Avatar = ({ name, size = 44, icon, style }) => {
  const { colors } = useTheme();

  const palettes = useMemo(
    () => [
      { bg: colors.primarySoft, fg: colors.primaryDeep },
      { bg: colors.accentSoft, fg: colors.success },
      { bg: colors.purpleSoft, fg: colors.purple },
      { bg: colors.amberSoft, fg: colors.amber },
      { bg: colors.roseSoft, fg: colors.rose },
    ],
    [colors]
  );

  const hash = (name || '')
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const palette = palettes[hash % palettes.length];

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.bg,
        },
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={size * 0.48} color={palette.fg} />
      ) : (
        <Text
          style={[
            styles.initials,
            { color: palette.fg, fontSize: size * 0.36 },
          ]}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default Avatar;
