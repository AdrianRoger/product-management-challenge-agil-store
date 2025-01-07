import path from "path";
import { config } from "dotenv";

export const getDatabasePath = (): string => {
  config();
  if (process.env.NODE_ENV === "dev") {
    return path.resolve(__dirname, "../database/dev_products_db.db");
  }

  /** it'll never used */
  if (process.env.USE_REMOTE_DB === "true") {
    return `https://${process.env.REMOTE_DB_URL}`;
  }

  return path.resolve(__dirname, "../database/products_db.db");
};
