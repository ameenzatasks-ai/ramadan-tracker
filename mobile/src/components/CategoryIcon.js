import React from 'react';
import Svg, { Path, Circle, Rect, Polyline } from 'react-native-svg';
import { colors } from '../theme/colors';

// Neutral, inclusive line illustrations using the spec illustration palette.
// stroke=#001e1d on a #e8e4e6 fill with #f9bc60 highlights and #abd1c6 / #e16162 accents.

const props = {
  stroke: colors.illoStroke,
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
};

function Frame({ children, size = 56 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="2" y="2" width="60" height="60" rx="14" fill={colors.illoMain} {...props} />
      {children}
    </Svg>
  );
}

export function CategoryIcon({ category, size = 56 }) {
  switch (category) {
    case 'salah':
      return (
        <Frame size={size}>
          {/* Prayer mat arch */}
          <Path d="M16 50 V30 a16 16 0 0 1 32 0 V50 Z" {...props} fill={colors.illoSecondary} />
          <Path d="M22 50 V32 a10 10 0 0 1 20 0 V50" {...props} fill={colors.illoHighlight} />
        </Frame>
      );
    case 'quran':
      return (
        <Frame size={size}>
          {/* Open book */}
          <Path d="M12 22 C20 18 28 18 32 22 C36 18 44 18 52 22 V48 C44 44 36 44 32 48 C28 44 20 44 12 48 Z" {...props} fill={colors.illoHighlight} />
          <Path d="M32 22 V48" {...props} />
        </Frame>
      );
    case 'charity':
      return (
        <Frame size={size}>
          {/* Hand offering a coin */}
          <Path d="M14 44 L14 32 C14 28 18 28 18 32 V36 H40 a6 6 0 0 1 0 12 H22 a8 8 0 0 1 -8 -4 Z" {...props} fill={colors.illoSecondary} />
          <Circle cx="32" cy="20" r="6" {...props} fill={colors.illoHighlight} />
        </Frame>
      );
    case 'family':
      return (
        <Frame size={size}>
          {/* Two figures, neutral silhouettes */}
          <Circle cx="24" cy="24" r="5" {...props} fill={colors.illoHighlight} />
          <Circle cx="42" cy="26" r="4" {...props} fill={colors.illoSecondary} />
          <Path d="M14 50 C14 40 20 36 24 36 C28 36 34 40 34 50" {...props} fill={colors.illoHighlight} />
          <Path d="M34 50 C34 42 38 38 42 38 C46 38 50 42 50 50" {...props} fill={colors.illoSecondary} />
        </Frame>
      );
    case 'adhkar':
      return (
        <Frame size={size}>
          {/* Tasbih beads in a ring */}
          <Path d="M32 12 a20 20 0 1 1 -0.1 0 Z" {...props} fill={colors.illoSecondary} />
          <Circle cx="32" cy="14" r="3" {...props} fill={colors.illoHighlight} />
          <Circle cx="50" cy="32" r="3" {...props} fill={colors.illoHighlight} />
          <Circle cx="32" cy="50" r="3" {...props} fill={colors.illoHighlight} />
          <Circle cx="14" cy="32" r="3" {...props} fill={colors.illoHighlight} />
        </Frame>
      );
    case 'dua':
      return (
        <Frame size={size}>
          {/* Two cupped hands raised */}
          <Path d="M18 46 C18 32 24 26 28 26 C30 26 32 28 32 32" {...props} fill={colors.illoHighlight} />
          <Path d="M46 46 C46 32 40 26 36 26 C34 26 32 28 32 32" {...props} fill={colors.illoSecondary} />
          <Path d="M18 46 H46 V50 H18 Z" {...props} fill={colors.illoStroke} />
        </Frame>
      );
    case 'custom':
      return (
        <Frame size={size}>
          {/* Plus / star */}
          <Path d="M32 18 V46 M18 32 H46" {...props} stroke={colors.illoStroke} />
          <Circle cx="32" cy="32" r="14" {...props} fill={colors.illoHighlight} />
          <Path d="M32 18 V46 M18 32 H46" {...props} />
        </Frame>
      );
    default:
      return <Frame size={size}><Circle cx="32" cy="32" r="14" {...props} fill={colors.illoHighlight} /></Frame>;
  }
}

// Neutral adult / child icons for profile picker (no gendered, age-gendered, or culturally specific markers).
export function ProfileIcon({ kind, size = 72 }) {
  if (kind === 'adult') {
    return (
      <Svg width={size} height={size} viewBox="0 0 72 72">
        <Rect x="2" y="2" width="68" height="68" rx="18" fill={colors.illoMain} {...props} />
        <Circle cx="36" cy="28" r="10" {...props} fill={colors.illoHighlight} />
        <Path d="M18 60 C18 48 26 42 36 42 C46 42 54 48 54 60" {...props} fill={colors.illoSecondary} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      <Rect x="2" y="2" width="68" height="68" rx="18" fill={colors.illoMain} {...props} />
      <Circle cx="36" cy="30" r="9" {...props} fill={colors.illoHighlight} />
      <Path d="M22 60 C22 50 28 46 36 46 C44 46 50 50 50 60" {...props} fill={colors.illoSecondary} />
    </Svg>
  );
}
