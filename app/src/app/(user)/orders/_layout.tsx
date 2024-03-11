import { Stack } from 'expo-router';

export default function AssetStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Orders' }} />
    </Stack>
  );
}
