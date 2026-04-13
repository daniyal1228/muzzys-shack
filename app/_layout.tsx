import { router, Stack, usePathname } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../.expo/lib/firebase";

export default function RootLayout() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.log("AUTH IS UNDEFINED");
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isOnLoginPage = pathname === "/login";

    if (!user && !isOnLoginPage) {
      router.replace("/login" as any);
    }

    if (user && isOnLoginPage) {
      router.replace("/dashboard" as any);
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6f3f2",
        }}
      >
        <ActivityIndicator size="large" color="#e11b1d" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}