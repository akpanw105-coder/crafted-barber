import { Stack } from 'expo-router';
import { StitchColors } from '@/constants/stitch-theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: StitchColors.surface },
        animation: 'slide_from_right',
      }}
    />
  );
}
