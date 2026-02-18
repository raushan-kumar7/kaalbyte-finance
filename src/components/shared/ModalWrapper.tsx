// import React from "react";
// import { TouchableOpacity, View, Pressable } from "react-native";
// import { ChevronLeft } from "lucide-react-native";
// import { colors } from "@/src/constants/colors";
// import { Typo } from "../ui";

// interface ModalWrapperProps {
//   title?: string;
//   children: React.ReactNode;
//   onClose: () => void;
// }

// const ModalWrapper = ({ title, children, onClose }: ModalWrapperProps) => {
//   return (
//     <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' }}>
//       {/* Dimmed Background Overlay */}
//       <Pressable
//         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
//         onPress={onClose}
//       />

//       <View
//         className="bg-brand-800 shadow-2xl rounded-t-[25px] border-t border-white/10"
//         style={{ minHeight: '92%', paddingTop: 20, paddingBottom: 40 }}
//       >
//         <View style={{ alignItems: 'center', marginBottom: 20 }}>
//           <View style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
//         </View>

//         <View style={{ paddingHorizontal: 32, flex: 1 }}>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
//             <TouchableOpacity onPress={onClose} className="p-2 bg-white/5 rounded-full">
//               <ChevronLeft size={20} color={colors.text.secondary} />
//             </TouchableOpacity>

//             <View style={{ flex: 1, marginLeft: 16 }}>
//               {title && (
//                 <Typo className="text-2xl font-serif-bold text-white leading-tight">
//                   {title}
//                 </Typo>
//               )}
//             </View>
//           </View>

//           <View style={{ flex: 1 }}>
//             {children}
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default ModalWrapper;

import React from "react";
import {
  TouchableOpacity,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { Typo } from "../ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ModalWrapperProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper = ({ title, children, onClose }: ModalWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        {/* Dimmed Background Overlay */}
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          onPress={onClose}
        />

        <View
          className="bg-brand-800 shadow-2xl rounded-t-[25px] border-t border-white/10"
          style={{
            height: "92%",
            paddingTop: 12,

            paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 40,
          }}
        >
          {/* Draggable Indicator Visual */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 2,
              }}
            />
          </View>

          <View style={{ paddingHorizontal: 24, flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <TouchableOpacity
                onPress={onClose}
                className="p-2 bg-white/5 rounded-full"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Easier to tap
              >
                <ChevronLeft size={20} color={colors.text.secondary} />
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: 16 }}>
                {title && (
                  <Typo className="text-2xl font-serif-bold text-white leading-tight">
                    {title}
                  </Typo>
                )}
              </View>
            </View>

            {/* Main Content Container 
                Flex: 1 ensures it takes up the rest of the 92% height 
            */}
            <View style={{ flex: 1 }}>{children}</View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ModalWrapper;