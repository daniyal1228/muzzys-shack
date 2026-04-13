import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../.expo/lib/firebase";
import AppShell from "../components/AppShell";

const roles = ["Manager", "Cashier", "Cook", "Driver", "Prep", "Dishwasher", "Other"];
const payTypes = ["Hourly", "Salary"];
const statuses = ["Active", "Inactive"];

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Cashier");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [payType, setPayType] = useState("Hourly");
  const [payRate, setPayRate] = useState("");
  const [hoursThisWeek, setHoursThisWeek] = useState("");
  const [status, setStatus] = useState("Active");

  const saveEmployee = async () => {
    try {
      if (!name.trim() || !payRate.trim()) {
        Alert.alert("Missing info", "Enter at least a name and pay rate.");
        return;
      }

      const cleanPayRate = Number(payRate.replace(/[^0-9.]/g, ""));
      const cleanHours = Number((hoursThisWeek || "0").replace(/[^0-9.]/g, ""));

      if (Number.isNaN(cleanPayRate)) {
        Alert.alert("Invalid pay rate", "Please enter a valid number.");
        return;
      }

      await addDoc(collection(db, "employees"), {
        name: name.trim(),
        role,
        email: email.trim(),
        phone: phone.trim(),
        payType,
        payRate: cleanPayRate,
        hoursThisWeek: Number.isNaN(cleanHours) ? 0 : cleanHours,
        status,
        createdAt: new Date(),
      });

      router.replace("/employees" as any);
    } catch (error) {
      console.log("Error saving employee:", error);
      Alert.alert("Error", "Could not save employee.");
    }
  };

  return (
    <AppShell title="Add Employee" subtitle="Create a new employee record">
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Ex: John Smith"
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={role} onValueChange={(v: any) => setRole(String(v))} style={styles.picker}>
            {roles.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Ex: john@email.com"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          placeholder="Ex: 267-555-1212"
        />

        <Text style={styles.label}>Pay Type</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={payType} onValueChange={(v: any) => setPayType(String(v))} style={styles.picker}>
            {payTypes.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Pay Rate</Text>
        <TextInput
          value={payRate}
          onChangeText={setPayRate}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ex: 18"
        />

        <Text style={styles.label}>Hours This Week</Text>
        <TextInput
          value={hoursThisWeek}
          onChangeText={setHoursThisWeek}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Ex: 32"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={status} onValueChange={(v: any) => setStatus(String(v))} style={styles.picker}>
            {statuses.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={saveEmployee} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add Employee</Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/employees" as any)} style={styles.secondaryButton}>
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#e11b1d",
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