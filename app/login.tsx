import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { auth } from "../.expo/lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const riseAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(riseAnim, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, riseAnim]);

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async () => {
    try {
      setErrorText("");

      if (!canSubmit) {
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
      colors={["#7f1212", "#b91c1c", "#d92d20", "#8f1111"]}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.page}
    >
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

      <Animated.View
        style={[
          styles.cardWrap,
          {
            opacity: fadeAnim,
            transform: [{ translateY: riseAnim }],
          },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Image
              source={require("../assets/images/muzzylogo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brand}>Muzzys Shack</Text>
          <Text style={styles.store}>Bensalem Store</Text>

          <View style={styles.brandDivider} />

          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Sign in to manage expenses, revenue, and staff
          </Text>

          <Text style={styles.label}>Email</Text>
          <View
            style={[
              styles.inputShell,
              emailFocused && styles.inputShellFocused,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={18}
              color={emailFocused ? "#dc2626" : "#6b7280"}
              style={styles.leftIcon}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputShell,
              passwordFocused && styles.inputShellFocused,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={passwordFocused ? "#dc2626" : "#6b7280"}
              style={styles.leftIcon}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeButton}
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={22}
                color="#6b7280"
              />
            </Pressable>
          </View>

          {errorText ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.error}>{errorText}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleLogin}
            disabled={loading || !canSubmit}
            onHoverIn={() => Platform.OS === "web" && setButtonHovered(true)}
            onHoverOut={() => Platform.OS === "web" && setButtonHovered(false)}
            style={({ pressed }) => [
              styles.button,
              (loading || !canSubmit) && styles.buttonDisabled,
              buttonHovered && styles.buttonHover,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={
                loading || !canSubmit
                  ? ["#ef4444", "#ef4444"]
                  : ["#ef2b2d", "#c9191d"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  bgGlowTop: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  cardWrap: {
    width: "100%",
    maxWidth: 560,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 30,
    paddingHorizontal: 38,
    paddingTop: 30,
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 6,
  },
  logo: {
    width: 132,
    height: 132,
  },
  brand: {
    color: "#d92d20",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.8,
  },
  store: {
    color: "#667085",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 18,
    fontWeight: "700",
    fontSize: 14,
  },
  brandDivider: {
    height: 1,
    backgroundColor: "#f0d7d7",
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 6,
    color: "#182032",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#667085",
    marginBottom: 24,
    fontSize: 17,
    lineHeight: 24,
  },
  label: {
    fontWeight: "800",
    marginBottom: 8,
    color: "#1f2937",
    fontSize: 15,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fcfcfd",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e4e7ec",
    paddingHorizontal: 14,
    marginBottom: 18,
    minHeight: 60,
  },
  inputShellFocused: {
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#101828",
  },
  eyeButton: {
    paddingLeft: 10,
    paddingVertical: 6,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef3f2",
    borderWidth: 1,
    borderColor: "#fecdca",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  error: {
    color: "#dc2626",
    fontWeight: "700",
    flex: 1,
    fontSize: 13,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
  },
  buttonHover: {
    transform: [{ translateY: -1 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.995 }],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 0.2,
  },
});