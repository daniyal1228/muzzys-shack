import { router } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useExpenses } from "../.vscode/hooks/useExpenses";
import AppShell from "../components/AppShell";
import { db } from "../lib/firebase";

const categoryStyles: any = {
  "Food & Supplies": { bg: "#fff2df", text: "#c77700" },
  Transportation: { bg: "#e6f8fb", text: "#0891b2" },
  Utilities: { bg: "#fff7cc", text: "#b58900" },
  "Rent & Lease": { bg: "#ffedd5", text: "#c66a00" },
  "Maintenance & Repairs": { bg: "#fee2e2", text: "#dc2626" },
  Insurance: { bg: "#e5e7eb", text: "#475569" },
  Marketing: { bg: "#dcfce7", text: "#15803d" },
  Equipment: { bg: "#dbeafe", text: "#1d4ed8" },
  Other: { bg: "#f3f4f6", text: "#6b7280" },
};

export default function Expenses() {
  const expenses = useExpenses();

  const removeExpense = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.log("Delete expense failed:", error);
    }
  };

  return (
    <AppShell title="Expenses" subtitle="Track purchases and bills">
      <Pressable
        onPress={() => router.push("/add-expense" as any)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Expense</Text>
      </Pressable>

      {expenses.map((item) => {
        const style = categoryStyles[item.category] || categoryStyles.Other;

        return (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title || "Untitled Expense"}</Text>

              <View style={[styles.badge, { backgroundColor: style.bg }]}>
                <Text style={[styles.badgeText, { color: style.text }]}>
                  {item.category || "Other"}
                </Text>
              </View>

              <Text style={styles.meta}>
                {item.date || "No date"} · {item.vendor || "Unknown Vendor"}
              </Text>

              <Text style={styles.meta}>
                {item.paymentMethod || "No payment method"}
              </Text>

              {item.recurring ? (
                <View style={styles.recurringPill}>
                  <Text style={styles.recurringPillText}>Recurring</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.right}>
              <Text style={styles.amount}>
                -${Number(item.amount || 0).toFixed(2)}
              </Text>

              <Pressable
                onPress={() => removeExpense(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#e11b1d",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eadfdb",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#161821",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: "#6f7487",
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  recurringPill: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "#fff1f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  recurringPillText: {
    color: "#e11d48",
    fontSize: 12,
    fontWeight: "bold",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: 120,
  },
  amount: {
    color: "#df1c1c",
    fontWeight: "bold",
    fontSize: 20,
  },
  deleteButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 16,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});