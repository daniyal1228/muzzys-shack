import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import AppShell from "../components/AppShell";
import { db } from "../lib/firebase";

const categories = [
  "Food & Supplies",
  "Transportation",
  "Utilities",
  "Rent & Lease",
  "Maintenance & Repairs",
  "Insurance",
  "Marketing",
  "Equipment",
  "Other",
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

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Supplies");
  const [vendor, setVendor] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [recurring, setRecurring] = useState(false);

  const saveExpense = async () => {
    if (!title || !amount) return;

    const cleanAmount = Number(amount.replace(/[^0-9.]/g, ""));
    if (isNaN(cleanAmount)) return;

    await addDoc(collection(db, "expenses"), {
      title,
      amount: cleanAmount,
      category,
      vendor,
      paymentMethod,
      date: getTodayLabel(),
      recurring,
      createdAt: new Date(),
    });

    router.push("/expenses" as any);
  };

  return (
    <AppShell title="Add Expense" subtitle="Log a new business expense">
      <View style={styles.card}>
        <Text style={styles.label}>Expense Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Ex: Paper Towels"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ex: 250"
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

        <Text style={styles.label}>Vendor</Text>
        <TextInput
          value={vendor}
          onChangeText={setVendor}
          style={styles.input}
          placeholder="Ex: Costco"
        />

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

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Recurring Expense</Text>
          <Switch value={recurring} onValueChange={setRecurring} />
        </View>

        <Pressable onPress={() => saveExpense()} style={styles.button}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </Pressable>
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    padding: 14,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  switchText: {
    fontWeight: "700",
    color: "#1f2937",
  },
  button: {
    backgroundColor: "#e11b1d",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});