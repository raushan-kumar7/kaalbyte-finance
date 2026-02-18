// import React from "react";
// import { Platform, StyleSheet, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Toast, { ToastProps } from "./Toasts";

// interface ToastContainerProps {
//   toasts: ToastProps[];
//   onDismiss: (id: string) => void;
// }

// const ToastContainer: React.FC<ToastContainerProps> = ({
//   toasts,
//   onDismiss,
// }) => {
//   const insets = useSafeAreaInsets();

//   if (toasts.length === 0) return null;

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           // Extra padding for iOS dynamic islands/notches
//           top: Platform.OS === "ios" ? insets.top : insets.top + 10,
//         },
//       ]}
//       pointerEvents="box-none"
//     >
//       {toasts.map((toast) => (
//         <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     zIndex: 9999,
//   },
// });

// export default ToastContainer;


import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { ToastProps } from "./Toasts";

interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          // Extra padding for iOS dynamic islands/notches
          top: Platform.OS === "ios" ? insets.top : insets.top + 10,
        },
      ]}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

export default ToastContainer;