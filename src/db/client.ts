import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";
import { APP_CONFIG } from "../config/app_cfg";

const DB_NAME = APP_CONFIG.app.db_name as string;
console.log("DB_NAME: ", DB_NAME)

export const expoDb = openDatabaseSync(DB_NAME, { enableChangeListener: true });
export const db = drizzle(expoDb, { schema });
