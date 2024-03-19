import { Redirect, Stack } from "expo-router";

// import { useAuth } from "providers/AuthProvider";

export default function AuthLayout() {
  const { session } = { session: null }; // || useAuth()
  if (session) {
    return <Redirect href={"/(user)/profile"} />;
  }

  return <Stack />;
}
