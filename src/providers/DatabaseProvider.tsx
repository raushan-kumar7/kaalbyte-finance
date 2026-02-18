import { Text } from "react-native";
import React from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { db } from "../db/client";

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.log("Migration error: ", error);
    return <Text>Loading...</Text>;
  }

  if (!success) {
    return <Text>Loading...</Text>;
  }
  return <>{children}</>;
};
