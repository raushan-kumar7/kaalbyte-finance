import { View } from "react-native";
import { Typo } from "../ui";

interface Props {
  label: string;
  percentage: number;
  spent: number;
  target: number;
  color: string;
}

const BudgetCard = ({ label, percentage, spent, target, color }: Props) => {
  const progress = Math.min((spent / target) * 100, 100);

  return (
    <View className="bg-ui-card w-[31%] p-3 rounded-2xl border border-white/5">
      <Typo className="text-text-secondary text-[10px] uppercase font-mono-bold mb-1">
        {label} ({percentage}%)
      </Typo>
      <Typo className="text-white font-mono-medium text-sm mb-3">
        ₹{spent.toLocaleString()}
      </Typo>

      {/** Progress Bar */}
      <View className="h-1.5 w-full bg-brand-900 rounded-full overflow-hidden">
        <View
          style={{ width: `${progress}%`, backgroundColor: color }}
          className="h-full rounded-full"
        />
      </View>
    </View>
  );
};

export default BudgetCard;
