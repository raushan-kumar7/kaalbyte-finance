export const colors = {
  // --- PRIMARY & BACKGROUND (Option #9) ---
  // Purpose: Brand identity and structural depth.
  brand: {
    50: "#E6E6EA", // Off-white for light-mode text or backgrounds
    100: "#B3BEDB", // Muted borders / Decorative lines
    200: "#7F91C1", // Disabled states (Buttons/Inputs)
    500: "#004B8E", // PRIMARY ACTION (Main Buttons, Active Icons)
    600: "#003D73", // Pressed State for buttons
    800: "#010A3D", // Card Surface (Elevation Level 1)
    900: "#010528", // GLOBAL APP BACKGROUND
  },

  // --- ASSETS & HIGHLIGHTS (Option #7) ---
  // Purpose: Specific to Gold, Equity, and "Premium" features.
  gold: {
    50: "#FBF8F2", // Light wash for asset chips
    100: "#F0E9DE", // Soft background for "Gold" cards
    500: "#B3945B", // PRIMARY GOLD (Icons, Market Rates, Weight)
    600: "#9C814F", // Active state for Asset filters
    900: "#4D3F27", // High-contrast text on light gold backgrounds
  },

  // --- SUCCESS & GROWTH (Option #3) ---
  // Purpose: 50/30/20 "Needs" & "Savings" buckets.
  success: {
    50: "#F0FAF7", // Success alert backgrounds
    100: "#D5F3E9", // Success borders
    500: "#9AE4CB", // "UNDER BUDGET" progress bars / Profits
    900: "#085078", // Contrast text for mint-colored badges
  },

  // --- DANGER & WARNING (Option #2) ---
  // Purpose: "Wants" bucket, Over-budget alerts, Deletions.
  danger: {
    50: "#FFF5F8", // Error backgrounds
    100: "#FDE6ED", // Error borders
    500: "#C8004A", // "OVER BUDGET" / Negative trends / Delete
    900: "#4B0C37", // Text on error alerts
  },

  // --- SEMANTIC UI LAYERS ---
  // Logic: Hierarchical surfaces for a clean "layered" look.
  ui: {
    background: "#010528", // Screen base
    card: "#010A3D", // Primary content containers
    item: "#0A0F35", // Individual list items/rows
    border: "#1E293B", // Subtle dividers
    input: "#0A1245", // Form field backgrounds
  },

  // --- TYPOGRAPHY ---
  text: {
    primary: "#FFFFFF", // Headlines, Large Amounts, Usernames
    secondary: "#9CA3AF", // Dates, Categories, "grams" labels, Help text
    muted: "#6B7280", // Placeholder text / Disabled labels
    inverse: "#010528", // Text on light-colored buttons (e.g., White/Gold buttons)
    link: "#4CA8DD", // Interactive text
  },

  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};
