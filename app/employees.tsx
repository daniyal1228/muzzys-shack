import { router } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../.expo/lib/firebase";
import { useEmployees } from "../.vscode/hooks/useEmployees";
import AppShell from "../components/AppShell";

export default function Employees() {
  const employees = useEmployees();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (item) => (item.status || "Active") === "Active"
  ).length;

  const weeklyPayroll = employees.reduce((sum, item) => {
    const payType = item.payType || "Hourly";
    const payRate = Number(item.payRate || 0);
    const hours = Number(item.hoursThisWeek || 0);

    if (payType === "Salary") return sum + payRate;
    return sum + payRate * hours;
  }, 0);

  const removeEmployee = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "employees", id));
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  return (
    <AppShell title="Employees" subtitle="Manage your staff and payroll info">
      <Pressable
        onPress={() => router.push("/add-employee" as any)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Employee</Text>
      </Pressable>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Employees</Text>
          <Text style={styles.statValue}>{totalEmployees}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Employees</Text>
          <Text style={[styles.statValue, { color: "#16a34a" }]}>
            {activeEmployees}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Weekly Payroll</Text>
          <Text style={[styles.statValue, { color: "#16a34a" }]}>
            ${weeklyPayroll.toFixed(2)}
          </Text>
        </View>
      </View>

      {employees.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name || "Unnamed Employee"}</Text>

            <View
              style={[
                styles.statusPill,
                (item.status || "Active") === "Active"
                  ? styles.activePill
                  : styles.inactivePill,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  (item.status || "Active") === "Active"
                    ? styles.activePillText
                    : styles.inactivePillText,
                ]}
              >
                {item.status || "Active"}
              </Text>
            </View>

            <Text style={styles.meta}>
              {item.role || "No role"} · {item.email || "No email"}
            </Text>

            <Text style={styles.meta}>
              {item.phone || "No phone"} · {item.payType || "Hourly"}
            </Text>
          </View>

          <View style={styles.right}>
            <Text style={styles.pay}>
              {item.payType === "Salary"
                ? `$${Number(item.payRate || 0).toFixed(2)}`
                : `$${Number(item.payRate || 0).toFixed(2)}/hr`}
            </Text>

            <Text style={styles.hours}>
              {Number(item.hoursThisWeek || 0).toFixed(1)} hrs
            </Text>

            <Pressable
              onPress={() => removeEmployee(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignSelf: "flex-start",
    backgroundColor: "#e11b1d",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 17,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eadfdb",
    padding: 18,
    minWidth: 220,
  },
  statLabel: {
    color: "#6f7487",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statValue: {
    color: "#1b2230",
    fontSize: 28,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eadfdb",
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1b2230",
    marginBottom: 8,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  activePill: {
    backgroundColor: "#dcfce7",
  },
  inactivePill: {
    backgroundColor: "#fee2e2",
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "800",
  },
  activePillText: {
    color: "#15803d",
  },
  inactivePillText: {
    color: "#dc2626",
  },
  meta: {
    color: "#6f7487",
    fontSize: 14,
    marginBottom: 4,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: 120,
  },
  pay: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "900",
  },
  hours: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    minWidth: 80,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "800",
  },
});