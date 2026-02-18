/** @type {import('tailwindcss').Config} */
// Import the colors from your constants file
const { colors } = require("./src/constants/colors");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        // Sans (Inter)
        sans: ["Inter-Regular"],
        "sans-medium": ["Inter-Medium"],
        "sans-semibold": ["Inter-SemiBold"],
        "sans-bold": ["Inter-Bold"],

        // Mono (Fira Code)
        mono: ["FiraCode-Regular"],
        "mono-medium": ["FiraCode-Medium"],
        "mono-semibold": ["FiraCode-SemiBold"],
        "mono-bold": ["FiraCode-Bold"],

        // Serif (Lora)
        serif: ["Lora-Regular"],
        "serif-medium": ["Lora-Medium"],
        "serif-semibold": ["Lora-SemiBold"],
        "serif-bold": ["Lora-Bold"],
      },
    },
  },
  plugins: [],
};
