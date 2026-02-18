/**
 * Formats currency amount intelligently based on value
 * Returns formatted string with appropriate suffix (K, L, Cr)
 */
export const formatCurrency = (
  amount: number,
): { value: string; suffix: string; full: string } => {
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    // 1 Crore or more
    return {
      value: (amount / 10000000).toFixed(2),
      suffix: "Cr",
      full: `₹${(amount / 10000000).toFixed(2)}Cr`,
    };
  } else if (absAmount >= 100000) {
    // 1 Lakh or more
    return {
      value: (amount / 100000).toFixed(2),
      suffix: "L",
      full: `₹${(amount / 100000).toFixed(2)}L`,
    };
  } else if (absAmount >= 1000) {
    // 1 Thousand or more
    return {
      value: (amount / 1000).toFixed(1),
      suffix: "k",
      full: `₹${(amount / 1000).toFixed(1)}k`,
    };
  } else {
    // Less than 1000
    return {
      value: amount.toFixed(0),
      suffix: "",
      full: `₹${amount.toFixed(0)}`,
    };
  }
};

/**
 * Formats currency with Indian number system (commas)
 */
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get compact format for small displays
 */
export const formatCompactCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (absAmount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (absAmount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  } else {
    return `₹${amount.toFixed(0)}`;
  }
};
