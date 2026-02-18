// import { View, TouchableOpacity } from "react-native";
// import React, { useState } from "react";
// import { cn } from "@/src/utils/cn";
// import { ChevronDown } from "lucide-react-native";
// import { colors } from "@/src/constants/colors";
// import Typo from "./Typo";
// import Picker from "./Picker";

// interface SelectOption {
//   label: string;
//   value: string | number;
// }

// interface SelectProps {
//   label?: string;
//   value?: string | number;
//   placeholder?: string;
//   onValueChange: (value: string | number) => void;
//   options: SelectOption[];
//   error?: string;
//   className?: string;
// }

// const Select = ({
//   label,
//   value,
//   placeholder,
//   onValueChange,
//   options,
//   error,
//   className = "",
// }: SelectProps) => {
//   const [isPickerVisible, setIsPickerVisible] = useState(false);

//   const selectedOption = options.find((opt) => opt.value === value);
//   const displayValue = selectedOption ? selectedOption.label : "";

//   return (
//     <>
//       <View className={cn("flex-col gap-2", className)}>
//         {label && (
//           <Typo variant="secondary" className="text-sm font-medium ml-1">
//             {label}
//           </Typo>
//         )}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() => setIsPickerVisible(true)}
//           className={cn(
//             "h-14 w-full flex-row items-center justify-between rounded-2xl border bg-ui-input px-4",
//             error ? "border-danger-500" : "border-ui-border"
//           )}
//         >
//           <Typo variant={displayValue ? "primary" : "muted"} className="text-base">
//             {displayValue || placeholder || "Select option"}
//           </Typo>
//           <ChevronDown size={20} color={colors.text.secondary} />
//         </TouchableOpacity>
//         {error && (
//           <Typo className="text-xs text-danger-500 ml-1 font-medium">
//             {error}
//           </Typo>
//         )}
//       </View>

//       <Picker
//         visible={isPickerVisible}
//         onClose={() => setIsPickerVisible(false)}
//         options={options}
//         selectedValue={value}
//         onSelect={onValueChange}
//         title={label || "Select an option"}
//       />
//     </>
//   );
// };

// export default Select;

import { View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { cn } from "@/src/utils/cn";
import { ChevronDown } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import Typo from "./Typo";
import Picker from "./Picker";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  label?: string;
  value?: string | number;
  placeholder?: string;
  onValueChange: (value: string | number) => void;
  options: SelectOption[];
  error?: string;
  className?: string;
}

const Select = ({
  label,
  value,
  placeholder,
  onValueChange,
  options,
  error,
  className = "",
}: SelectProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  return (
    <>
      <View className={cn("flex-col gap-2", className)}>
        {label && (
          <Typo variant="secondary" className="text-sm font-medium ml-1">
            {label}
          </Typo>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsPickerVisible(true)}
          className={cn(
            "h-14 w-full flex-row items-center justify-between rounded-2xl border bg-ui-input px-4",
            error ? "border-danger-500" : "border-ui-border"
          )}
        >
          <Typo variant={displayValue ? "primary" : "muted"} className="text-base">
            {displayValue || placeholder || "Select option"}
          </Typo>
          <ChevronDown size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        {error && (
          <Typo className="text-xs text-danger-500 ml-1 font-medium">
            {error}
          </Typo>
        )}
      </View>

      <Picker
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        options={options}
        selectedValue={value}
        onSelect={onValueChange}
        title={label || "Select an option"}
      />
    </>
  );
};

export default Select;