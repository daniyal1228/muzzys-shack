import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useExpenses } from "../.vscode/hooks/useExpenses";
import { useRevenue } from "../.vscode/hooks/useRevenue";
import AppShell from "../components/AppShell";
import RevenueExpensesChart from "../components/RevenueExpensesChart";
import ExpensesOverviewPanels from "../components/ExpensesOverviewPanels";

export default function Dashboard() {
  const expenses = useExpenses();
  const revenue = useRevenue();

  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
  const currentYear = new Date().getFullYear().toString();

  const thisMonthExpenses = expenses.filter(
    (item) =>
      typeof item.date === "string" &&
      item.date.includes(currentMonth) &&
      item.date.includes(currentYear)
  );

  const thisMonthRevenue = revenue.filter(
    (item) =>
      typeof item.date === "string" &&
      item.date.includes(currentMonth) &&
      item.date.includes(currentYear)
  );

  const totalExpenses = thisMonthExpenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalRevenue = thisMonthRevenue.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const monthProfit = totalRevenue - totalExpenses;

  const allRevenue = revenue.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const allExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const allProfit = allRevenue - allExpenses;

  const monthBuckets = getLast6Months();

  const chartData = monthBuckets.map((month) => {
    const revenueTotal = revenue
      .filter((item) => matchesMonth(item.date, month.label, month.year))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const expenseTotal = expenses
      .filter((item) => matchesMonth(item.date, month.label, month.year))
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return {
      label: month.label,
      revenue: revenueTotal,
      expenses: expenseTotal,
    };
  });

  return (
    <AppShell
      title="Dashboard"
      subtitle={`Live business overview · ${currentMonth} ${currentYear}`}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profitCard}>
          <Text style={styles.profitLabel}>Profit · This Month</Text>
          <Text style={styles.profitValue}>${monthProfit.toFixed(2)}</Text>
          <Text style={styles.profitSub}>
            Revenue ${totalRevenue.toFixed(2)} · Expenses ${totalExpenses.toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Revenue</Text>
            <Text style={styles.green}>${totalRevenue.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.red}>${totalExpenses.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>All-Time Revenue</Text>
            <Text style={styles.normal}>${allRevenue.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>All-Time Profit</Text>
            <Text style={styles.green}>${allProfit.toFixed(2)}</Text>
          </View>
        </View>

        <RevenueExpensesChart data={chartData} />

        <ExpensesOverviewPanels expenses={expenses} />

       

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Revenue</Text>
          {revenue.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.listCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>
                  {item.title || "Untitled Revenue"}
                </Text>
                <Text style={styles.listMeta}>
                  {item.date || "No date"} ·{" "}
                  {item.paymentMethod || "No payment method"}
                </Text>
              </View>
              <Text style={styles.revenueAmount}>
                +${Number(item.amount || 0).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

function matchesMonth(dateValue: any, monthLabel: string, year: string) {
  return (
    typeof dateValue === "string" &&
    dateValue.includes(monthLabel) &&
    dateValue.includes(year)
  );
}

function getLast6Months() {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear().toString(),
    });
  }

  return months;
}

const styles = StyleSheet.create({
  profitCard: {
    backgroundColor: "#eef9f0",
    padding: 24,
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#b7e3c0",
  },
  profitLabel: {
    color: "#16a34a",
    fontWeight: "800",
    fontSize: 16,
  },
  profitValue: {
    fontSize: 46,
    fontWeight: "900",
    color: "#16a34a",
    marginTop: 8,
  },
  profitSub: {
    color: "#555",
    marginTop: 6,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: 220,
    borderWidth: 1,
    borderColor: "#eadfdb",
  },
  cardLabel: {
    color: "#777",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  green: {
    color: "#16a34a",
    fontWeight: "900",
    fontSize: 26,
  },
  red: {
    color: "#dc2626",
    fontWeight: "900",
    fontSize: 26,
  },
  normal: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 26,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#161821",
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eadfdb",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#161821",
  },
  listMeta: {
    fontSize: 13,
    color: "#6f7487",
    marginTop: 4,
  },
  listAmount: {
    color: "#dc2626",
    fontSize: 18,
    fontWeight: "900",
    alignSelf: "center",
  },
  revenueAmount: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "900",
    alignSelf: "center",
  },
});