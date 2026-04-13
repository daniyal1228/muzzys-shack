import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../.expo/lib/firebase";
import AppShell from "../components/AppShell";

const categories = [
  "Food Sales",
  "Beverage Sales",
  "Online Orders",
  "Catering",
  "Other Income",
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Check",
  "Online",
];

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AddRevenue() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food Sales");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const saveRevenue = async () => {
    try {
      if (!title.trim() || !amount.trim()) {
        Alert.alert("Missing info", "Please enter a title and amount.");
        return;
      }

      const cleanAmount = Number(amount.replace(/[^0-9.]/g, ""));

      if (Number.isNaN(cleanAmount)) {
        Alert.alert("Invalid amount", "Please enter a valid number.");
        return;
      }

      await addDoc(collection(db, "revenue"), {
        title: title.trim(),
        amount: cleanAmount,
        category,
        paymentMethod,
        date: getTodayLabel(),
        createdAt: new Date(),
      });

      router.replace("/revenue" as any);
    } catch (error) {
      console.log("Error saving revenue:", error);
      Alert.alert("Error", "Could not save revenue.");
    }
  };

  return (
    <AppShell title="Add Revenue" subtitle="Log new income">
      <View style={styles.card}>
        <Text style={styles.label}>Revenue Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Ex: Weekend Food Sales"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ex: 1200"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={category}
            onValueChange={(v: any) => setCategory(String(v))}
            style={styles.picker}
          >
            {categories.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(v: any) => setPaymentMethod(String(v))}
            style={styles.picker}
          >
            {paymentMethods.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Date</Text>
          <Text style={styles.dateValue}>{getTodayLabel()}</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={saveRevenue} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add Revenue</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/revenue" as any)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eadfdb",
    maxWidth: 650,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
    color: "#1f2937",
  },
  input: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pickerWrap: {
    backgroundColor: "#fafafa",
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  dateBox: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    marginBottom: 14,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d7dce3",
  },
  secondaryButtonText: {
    color: "#1f2937",
    fontWeight: "800",
    fontSize: 15,
  },
});