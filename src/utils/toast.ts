import Toast from "react-native-toast-message";

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      visibilityTime: 3000,
      topOffset: 60,
    });
  },

  error: (title: string, message?: string) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      visibilityTime: 4000,
      topOffset: 60,
    });
  },

  info: (title: string, message?: string) => {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      visibilityTime: 3000,
      topOffset: 60,
    });
  },

  warning: (title: string, message?: string) => {
    Toast.show({
      type: "warning",
      text1: title,
      text2: message,
      visibilityTime: 3500,
      topOffset: 60,
    });
  },
};
