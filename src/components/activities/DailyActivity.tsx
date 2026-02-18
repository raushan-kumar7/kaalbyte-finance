// import React from "react";
// import { View } from "react-native";
// import { TransactionGroup } from "../history";

// const DailyActivity = () => (
//   <View className="gap-y-5">
//     <TransactionGroup
//       date="Feb 07, 2026"
//       total={2450}
//       items={[
//         {
//           category: "Foods",
//           amount: 450,
//           bucket: "Needs",
//           description: "Office Lunch",
//         },
//         {
//           category: "Tea & Snacks",
//           amount: 2000,
//           bucket: "Wants",
//           description: "Team Celebration",
//         },
//       ]}
//     />
//     <TransactionGroup
//       date="Feb 06, 2026"
//       total={12000}
//       items={[
//         {
//           category: "PG Rent",
//           amount: 12000,
//           bucket: "Needs",
//           description: "Monthly Accommodation",
//         },
//       ]}
//     />
//   </View>
// );

// export default DailyActivity;


import React from "react";
import { View, ActivityIndicator } from "react-native";
import { TransactionGroup } from "../history";
import { useCurrentMonthEntries } from "@/src/hooks";
import { Typo } from "../ui";
import { colors } from "@/src/constants/colors";

const DailyActivity = () => {
  const { entries, isLoading, error } = useCurrentMonthEntries();

  // Group entries by date
  const groupedByDate = React.useMemo(() => {
    const groups: Record<string, typeof entries> = {};

    entries.forEach((entry) => {
      const date = new Date(entry.date);
      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });

    return groups;
  }, [entries]);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <ActivityIndicator size="large" color={colors.gold[500]} />
        <Typo className="text-text-muted mt-4 font-mono text-xs">
          Loading transactions...
        </Typo>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center py-10">
        <Typo className="text-danger-500 font-mono text-xs">{error}</Typo>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View className="items-center justify-center py-10">
        <Typo className="text-text-muted font-mono text-xs">
          No transactions found for this month
        </Typo>
      </View>
    );
  }

  return (
    <View className="gap-y-5">
      {sortedDates.map((date) => {
        const dayEntries = groupedByDate[date];
        const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);

        const items = dayEntries.map((entry) => ({
          category: entry.category,
          amount: entry.amount,
          bucket: entry.bucket,
          description: entry.description,
        }));

        return (
          <TransactionGroup
            key={date}
            date={date}
            total={dayTotal}
            items={items}
          />
        );
      })}
    </View>
  );
};

export default DailyActivity;