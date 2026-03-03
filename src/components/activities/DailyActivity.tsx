import React from "react";
import { View, ActivityIndicator } from "react-native";
import { TransactionGroup } from "../history";
import { useCurrentMonthEntries } from "@/src/hooks";
import { Typo } from "../ui";
import { colors } from "@/src/constants/colors";

const DailyActivity = () => {
  const { entries, isLoading, error } = useCurrentMonthEntries();

  // Group entries by date
  // const groupedByDate = React.useMemo(() => {
  //   const groups: Record<string, typeof entries> = {};

  //   entries.forEach((entry) => {
  //     const date = new Date(entry.date);
  //     const dateKey = date.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "2-digit",
  //       year: "numeric",
  //     });

  //     if (!groups[dateKey]) {
  //       groups[dateKey] = [];
  //     }
  //     groups[dateKey].push(entry);
  //   });

  //   return groups;
  // }, [entries]);

  // const groupedByDate = React.useMemo(() => {
  //   const groups: Record<string, typeof entries> = {};

  //   entries.forEach((entry) => {
  //     // Use a more robust date parsing or ensure timezone consistency
  //     const date = new Date(entry.date);

  //     // Ensure the date is valid before formatting
  //     if (isNaN(date.getTime())) return;

  //     const dateKey = date.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "2-digit",
  //       year: "numeric",
  //     });

  //     if (!groups[dateKey]) {
  //       groups[dateKey] = [];
  //     }
  //     groups[dateKey].push(entry);
  //   });

  //   return groups;
  // }, [entries]);

  const groupedByDate = React.useMemo(() => {
    const groups: Record<string, typeof entries> = {};

    entries.forEach((entry) => {
      let date: Date;

      // Handle both Date objects and strings
      if (entry.date instanceof Date) {
        date = entry.date;
      } else {
        // Force parsing as local date to prevent UTC "Day Sliding"
        const parts = String(entry.date).split(/[-/T]/);
        date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      }

      if (isNaN(date.getTime())) return;

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

  // console.log('Raw Entries:', entries);
  // console.log('Selected Month:', selectedMonth);

  return (
    <View className="gap-y-5">
      {sortedDates.map((date) => {
        const dayEntries = groupedByDate[date];
        const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.amount, 0);
        console.log("Day Entries: ", date)

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