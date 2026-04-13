import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../.expo/lib/firebase";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setErrorText("");

      if (!email.trim() || !password.trim()) {
        setErrorText("Enter your email and password.");
        return;
      }

      setLoading(true);

      await signInWithEmailAndPassword(auth, email.trim(), password);

      router.replace("/dashboard" as any);
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      setErrorText(
        `${error?.code || "unknown-error"} ${error?.message || ""}`.trim()
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#b91c1c", "#e11b1d", "#991b1b"]}
      style={styles.page}
    >
      <View style={styles.card}>
        {/* 🔴 BIG LOGO */}
        <Image
          source={require("../assets/images/muzzylogo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brand}>Muzzys Shack</Text>
        <Text style={styles.store}>Bensalem Store</Text>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Access your business dashboard</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
        />

        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, loading && { opacity: 0.7 }]}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  // 🔥 BIGGER CARD
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 36,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },

  // 🔥 BIG LOGO
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 12,
  },

  brand: {
    color: "#e11b1d",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  store: {
    color: "#6f7487",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 6,
    color: "#1b2230",
  },

  subtitle: {
    color: "#6f7487",
    marginBottom: 22,
  },

  label: {
    fontWeight: "800",
    marginBottom: 6,
    color: "#1f2937",
  },

  input: {
    backgroundColor: "#fafafa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 15,
  },

  error: {
    color: "#dc2626",
    marginBottom: 10,
    fontWeight: "700",
  },

  // 🔥 STRONG BUTTON
  button: {
    backgroundColor: "#e11b1d",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 17,
  },
});