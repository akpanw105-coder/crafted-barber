import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StitchColors, StitchTypography } from '@/constants/stitch-theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function StitchHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={20} color={StitchColors.onSurface} />
          </TouchableOpacity>
        )}
        <View style={styles.branding}>
          <Text style={styles.brandTitle}>CRAFTED BARBERS</Text>
          <Text style={styles.screenTitle}>{title}</Text>
          {subtitle ? <Text style={styles.subTitle}>{subtitle}</Text> : null}
        </View>
      </View>

      <View style={styles.rightAction}>
        {rightAction ? rightAction : (
          <View style={styles.avatarPill}>
            <Ionicons name="person" size={15} color={StitchColors.onPrimary} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: 'rgba(19, 19, 19, 0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: StitchColors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: StitchColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  branding: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: StitchColors.primary,
    fontWeight: '600',
  },
  screenTitle: {
    fontFamily: StitchTypography.serif,
    fontSize: 16,
    color: StitchColors.onSurface,
    fontWeight: '600',
    marginTop: 1,
  },
  subTitle: {
    fontFamily: StitchTypography.sans,
    fontSize: 12,
    color: StitchColors.onSurfaceVariant,
    marginTop: 1,
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: StitchColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
