import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Prevent multiple connections in development (hot reload)
declare global {
  // eslint-disable-next-line no-var
  var _pgClient: postgres.Sql | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set in .env.local");
  return postgres(url, { max: 10 });
}

const client = global._pgClient ?? createClient();
if (process.env.NODE_ENV !== "production") global._pgClient = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
