import { Redirect, Stack } from "expo-router";

// import { useAuth } from "@/providers/AuthProvider";

export default function AuthLayout() {
  // const { session } = null;//useAuth() || {};
  const session = null;
  if (session) {
    return <Redirect href={"/"} />;
  }

  return <Stack />;
}
