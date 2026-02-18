import { useState, useCallback } from "react";

interface NotificationSettings {
  transactions: boolean;
  security: boolean;
  monthlyReport: boolean;
}

type SettingKey = keyof NotificationSettings;

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    transactions: true,
    security: true,
    monthlyReport: true,
  });

  const toggle = useCallback((key: SettingKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { settings, toggle };
};
