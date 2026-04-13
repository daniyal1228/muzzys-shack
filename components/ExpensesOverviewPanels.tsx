import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

type ExpenseItem = {
  id?: string;
  title?: string;
  amount?: number;
  category?: string;
  date?: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  "Rent & Lease": "#D88B33",
  "Food & Supplies": "#57A196",
  Insurance: "#434D67",
  Utilities: "#DFC15E",
  "Maintenance & Repairs": "#D9534F",
  Transportation: "#8FD4E0",
  Marketing: "#A855F7",
  Equipment: "#60A5FA",
  Other: "#C7CDD8",
};

function formatMoney(n: number) {
  return `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function shortDate(value?: string) {
  if (!value) return "No date";
  const parts = value.split(" ");
  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1].replace(",", "")}`;
  }
  return value;
}

function getCategoryStyle(category?: string) {
  switch (category) {
    case "Food & Supplies":
      return {
        bg: "#F8E8CF",
        text: "#C25E1A",
      };
    case "Transportation":
      return {
        bg: "#D9F4F7",
        text: "#2F6F8D",
      };
    case "Utilities":
      return {
        bg: "#EFE7AA",
        text: "#A47A11",
      };
    case "Maintenance & Repairs":
      return {
        bg: "#F6DADB",
        text: "#C13D34",
      };
    case "Rent & Lease":
      return {
        bg: "#F7E3C9",
        text: "#B86B1C",
      };
    default:
      return {
        bg: "#ECEEF2",
        text: "#5F6B7A",
      };
  }
}

function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const size = 220;
  const strokeWidth = 52;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let cumulative = 0;

  if (!total) {
    return (
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E9E4E1"
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F0EBE8"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {data.map((item, index) => {
        const fraction = item.value / total;
        const dash = fraction * circumference;
        const gap = circumference - dash;
        const offset = -cumulative * circumference;

        cumulative += fraction;

        return (
          <Circle
            key={`${item.label}-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={item.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            rotation={-90}
            originX={size / 2}
            originY={size / 2}
            strokeLinecap="butt"
          />
        );
      })}
    </Svg>
  );
}

export default function ExpensesOverviewPanels({
  expenses,
}: {
  expenses: ExpenseItem[];
}) {
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "short" });
  const currentYear = now.getFullYear().toString();

  const thisMonthExpenses = expenses.filter(
    (item) =>
      typeof item.date === "string" &&
      item.date.includes(currentMonth) &&
      item.date.includes(currentYear)
  );

  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach((item) => {
    const key = item.category || "Other";
    categoryTotals[key] = (categoryTotals[key] || 0) + Number(item.amount || 0);
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([label, value]) => ({
      label,
      value,
      color: CATEGORY_COLORS[label] || CATEGORY_COLORS.Other,
    }))
    .sort((a, b) => b.value - a.value);

  const recentExpenses = [...expenses]
    .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
    .slice(0, 5);

  return (
    <View style={styles.grid}>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Expenses by Category (This Month)</Text>

        <View style={styles.chartWrap}>
          <DonutChart data={sortedCategories} />
        </View>

        <View style={styles.legendList}>
          {sortedCategories.slice(0, 5).map((item) => (
            <View key={item.label} style={styles.legendRow}>
              <View style={styles.legendLeft}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabel}>{item.label}</Text>
              </View>
              <Text style={styles.legendValue}>{formatMoney(item.value)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.recentHeader}>
          <Text style={styles.panelTitle}>Recent Expenses</Text>
          <Text style={styles.viewAll}>View all →</Text>
        </View>

        {recentExpenses.map((item, index) => {
          const pill = getCategoryStyle(item.category);

          return (
            <View
              key={item.id || `${item.title}-${index}`}
              style={[
                styles.expenseRow,
                index !== recentExpenses.length - 1 && styles.expenseRowBorder,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseTitle}>
                  {item.title || "Untitled Expense"}
                </Text>

                <View style={styles.metaRow}>
                  <View
                    style={[styles.categoryPill, { backgroundColor: pill.bg }]}
                  >
                    <Text style={[styles.categoryPillText, { color: pill.text }]}>
                      {item.category || "Other"}
                    </Text>
                  </View>

                  <Text style={styles.expenseDate}>{shortDate(item.date)}</Text>
                </View>
              </View>

              <Text style={styles.expenseAmount}>
                -{formatMoney(Number(item.amount || 0))}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 20,
    marginBottom: 24,
  },
  panel: {
    flex: 1,
    minWidth: 380,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5DDD8",
    padding: 24,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1C2230",
    marginBottom: 18,
  },
  chartWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  legendList: {
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  legendLabel: {
    fontSize: 16,
    color: "#6C7487",
    fontWeight: "600",
  },
  legendValue: {
    fontSize: 16,
    color: "#1F2430",
    fontWeight: "800",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  viewAll: {
    color: "#D63B30",
    fontSize: 16,
    fontWeight: "600",
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 18,
  },
  expenseRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE7E2",
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2430",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "800",
  },
  expenseDate: {
    color: "#71798D",
    fontSize: 15,
    fontWeight: "500",
  },
  expenseAmount: {
    alignSelf: "center",
    color: "#1F2430",
    fontSize: 18,
    fontWeight: "900",
  },
});