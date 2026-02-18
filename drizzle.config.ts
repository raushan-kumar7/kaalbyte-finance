import type { Config } from "drizzle-kit";

// export default {
//   schema: "./src/db/schema",
//   out: "./drizzle",
//   dialect: "sqlite",
//   driver: "expo",
// } satisfies Config;


export default {
  schema: "./src/db/schema", // Ensure this path is correct!
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
  dbCredentials: {
    url: "sqlite.db", // Placeholder for the CLI
  },
} satisfies Config;