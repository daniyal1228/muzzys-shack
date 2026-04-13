import { View, Text, StyleSheet } from "react-native";

type Point = {
  label: string;
  revenue: number;
  expenses: number;
};

export default function RevenueExpensesChart({
  data,
}: {
  data: Point[];
}) {
  const maxValue = Math.max(
    100,
    ...data.flatMap((item) => [item.revenue, item.expenses])
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Revenue vs Expenses (Last 6 Months)</Text>

      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          <Text style={styles.axisText}>${Math.round(maxValue)}</Text>
          <Text style={styles.axisText}>${Math.round(maxValue * 0.75)}</Text>
          <Text style={styles.axisText}>${Math.round(maxValue * 0.5)}</Text>
          <Text style={styles.axisText}>${Math.round(maxValue * 0.25)}</Text>
          <Text style={styles.axisText}>$0</Text>
        </View>

        <View style={styles.plotArea}>
          <View style={[styles.gridLine, { top: 0 }]} />
          <View style={[styles.gridLine, { top: "25%" }]} />
          <View style={[styles.gridLine, { top: "50%" }]} />
          <View style={[styles.gridLine, { top: "75%" }]} />
          <View style={[styles.gridLine, { top: "100%" }]} />

          <View style={styles.barRow}>
            {data.map((item) => {
              const revenueHeight = (item.revenue / maxValue) * 240;
              const expenseHeight = (item.expenses / maxValue) * 240;

              return (
                <View key={item.label} style={styles.group}>
                  <View style={styles.pair}>
                    <View
                      style={[
                        styles.bar,
                        styles.revenueBar,
                        { height: revenueHeight || 2 },
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        styles.expenseBar,
                        { height: expenseHeight || 2 },
                      ]}
                    />
                  </View>
                  <Text style={styles.monthLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#16a34a" }]} />
          <Text style={styles.legendText}>Revenue</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#dc2626" }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eadfdb",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#161821",
    marginBottom: 18,
  },
  chartArea: {
    flexDirection: "row",
    minHeight: 280,
  },
  yAxis: {
    width: 64,
    height: 260,
    justifyContent: "space-between",
    paddingBottom: 18,
  },
  axisText: {
    color: "#6f7487",
    fontSize: 12,
  },
  plotArea: {
    flex: 1,
    height: 260,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0ecea",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 12,
  },
  group: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    height: 260,
  },
  pair: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 240,
  },
  bar: {
    width: 26,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  revenueBar: {
    backgroundColor: "#16a34a",
  },
  expenseBar: {
    backgroundColor: "#dc2626",
  },
  monthLabel: {
    marginTop: 10,
    color: "#6f7487",
    fontSize: 13,
  },
  legendRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    color: "#4b5563",
    fontSize: 15,
    fontWeight: "700",
  },
});