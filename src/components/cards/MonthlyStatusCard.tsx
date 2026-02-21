import React from "react";
import { View } from "react-native";
import { colors } from "@/src/constants/colors";
import { ArrowUpRight, ArrowDownRight, Activity, Calendar } from "lucide-react-native";
import { Typo } from "../ui";
import { formatMonthDisplay } from "@/src/utils/date";

interface MonthlyStatus {
  month: string; // YYYY-MM format
  salary: number;
  expenses: number;
  remaining: number;
}

interface MonthlyStatusCardProps {
  monthlyStats: MonthlyStatus;
}

const MonthlyStatusCard = ({ monthlyStats }: MonthlyStatusCardProps) => {
  const { month, salary, expenses, remaining } = monthlyStats;

  // --- DATE CALCULATIONS ---
  const today = new Date();
  
  // Parse YYYY-MM format correctly
  const [yearStr, monthStr] = month.split('-');
  const currentYear = parseInt(yearStr);
  const currentMonth = parseInt(monthStr) - 1; // Convert to 0-based index
  
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysRemaining = Math.max(lastDayOfMonth - today.getDate(), 0);
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  // --- FINANCIAL CALCULATIONS ---
  const spentPercentage = salary > 0 ? Math.min((expenses / salary) * 100, 100) : 0;
  const remainingPercentage = salary > 0 ? Math.max(100 - spentPercentage, 0) : 0;
  
  const isHealthy = spentPercentage < 75;
  const isCritical = spentPercentage >= 90;

  return (
    <View className="bg-brand-800 rounded-[28px] p-5 border border-white/10 shadow-xl mb-6">
      {/* Top Row: Month & Health Badge */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Activity size={14} color={colors.gold[500]} />
          <Typo className="font-mono-bold text-[10px] uppercase tracking-[1.5px] ml-2 text-gold-500">
            {formatMonthDisplay(month)}
          </Typo>
        </View>
        
        {/* Days Remaining Badge */}
        {isCurrentMonth && (
          <View className="flex-row items-center bg-white/5 px-2 py-1 rounded-lg border border-white/5">
            <Calendar size={10} color={colors.white} opacity={0.5} />
            <Typo className="font-mono-bold text-[9px] text-white/70 ml-1.5 uppercase">
              {daysRemaining} Days Left
            </Typo>
          </View>
        )}
      </View>

      {/* Middle Row: Balance and Breakdown */}
      <View className="flex-row justify-between items-end mb-5">
        <View className="flex-1">
          <Typo variant="secondary" className="font-mono text-[9px] uppercase tracking-wider mb-1 opacity-60">
            Available Balance
          </Typo>
          <Typo className="font-serif-bold text-2xl text-white">
            ₹{remaining.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </Typo>
        </View>
        <View className="items-end">
          <View className="flex-row items-center mb-1.5">
            <ArrowUpRight size={12} color={colors.success[500]} />
            <Typo className="font-mono-semibold text-[11px] text-white/90 ml-1">
              ₹{salary.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </Typo>
          </View>
          <View className="flex-row items-center">
            <ArrowDownRight size={12} color={colors.danger[500]} />
            <Typo className="font-mono-semibold text-[11px] text-white/90 ml-1">
              ₹{expenses.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </Typo>
          </View>
        </View>
      </View>

      {/* Bottom Row: Progress Bar */}
      <View>
        <View className="h-[5px] w-full bg-white/5 rounded-full overflow-hidden">
          <View 
            className={`h-full rounded-full ${
              isCritical ? 'bg-danger-500' : isHealthy ? 'bg-success-500' : 'bg-gold-500'
            }`} 
            style={{ width: `${remainingPercentage}%` }} 
          />
        </View>
        
        <View className="flex-row justify-between mt-2.5">
          <Typo className="font-mono text-[8px] text-white/40 uppercase tracking-widest">
            {isCritical ? 'Stop Spending' : isHealthy ? 'On Track' : 'Tight Budget'}
          </Typo>
          
          <View className="flex-row items-center">
             <Typo className="font-mono text-[8px] text-white/30 uppercase mr-1">
              Daily Limit:
            </Typo>
            <Typo className="font-mono-bold text-[9px] text-white/70">
              ₹{daysRemaining > 0 ? Math.floor(remaining / daysRemaining).toLocaleString("en-IN") : 0}
            </Typo>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MonthlyStatusCard;