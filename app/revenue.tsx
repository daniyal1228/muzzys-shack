import { router } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../.expo/lib/firebase";
import { useRevenue } from "../.vscode/hooks/useRevenue";
import AppShell from "../components/AppShell";

const categoryStyles: any = {
  "Food Sales": { bg: "#dcfce7", text: "#15803d" },
  "Beverage Sales": { bg: "#dbeafe", text: "#1d4ed8" },
  "Online Orders": { bg: "#ede9fe", text: "#6d28d9" },
  Catering: { bg: "#fef3c7", text: "#b45309" },
  "Other Income": { bg: "#f3f4f6", text: "#4b5563" },
};

export default function Revenue() {
  const revenue = useRevenue();

  const removeRevenue = async (id: string | undefined) => {
    if (!id) return;

    try {
      await deleteDoc(doc(db, "revenue", id));
    } catch (error) {
      console.log("Delete revenue failed:", error);
    }
  };

  return (
    <AppShell title="Revenue" subtitle="Track income and sales">
      <Pressable
        onPress={() => router.push("/add-revenue" as any)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Add Revenue</Text>
      </Pressable>

      {revenue.map((item) => {
        const style =
          categoryStyles[item.category] || categoryStyles["Other Income"];

        return (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title || "Untitled Revenue"}</Text>

              <View style={[styles.badge, { backgroundColor: style.bg }]}>
                <Text style={[styles.badgeText, { color: style.text }]}>
                  {item.category || "Other Income"}
                </Text>
              </View>

              <Text style={styles.meta}>
                {item.date || "No date"} ·{" "}
                {item.paymentMethod || "No payment method"}
              </Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.amount}>
                +${Number(item.amount || 0).toFixed(2)}
              </Text>

              <Pressable
                onPress={() => removeRevenue(item.id)}
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
    alignSelf: "flex-start",
    backgroundColor: "#16a34a",
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
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1b2230",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
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
  amount: {
    color: "#16a34a",
    fontSize: 20,
    fontWeight: "900",
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