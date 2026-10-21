import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppProvider } from '@/context/AppContext';
import { StitchColors } from '@/constants/stitch-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash after first render
    SplashScreen.hideAsync();
  }, []);

  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: StitchColors.surface },
          animation: 'none',
        }}>
        {/* Root entry - redirects to customer by default */}
        <Stack.Screen name="index" />
        {/* Customer group */}
        <Stack.Screen name="(customer)" />
        {/* Admin group */}
        <Stack.Screen name="(admin)" />
      </Stack>
    </AppProvider>
  );
}
