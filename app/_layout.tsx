import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useBookStore } from '../src/store/useBookStore';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const isDarkMode = useBookStore((s) => s.isDarkMode);
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useBookStore.persist.onFinishHydration(() => {
      setReady(true);
    });
    if (useBookStore.persist.hasHydrated()) {
      setReady(true);
    }
    return () => unsub();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {ready && (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: 'slide_from_right'
          }}
      
        />
      )}
    </View>
  );
}