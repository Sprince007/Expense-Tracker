import { defineConfig } from "drizzle-kit"
export default defineConfig({
    schema: "./utils/schema.jsx",
    dialect: "postgresql",
    dbCredentials: {
      url: 'postgresql://Accounts:VuPHY1t6cOwa@ep-cool-shape-a5f3tgse.us-east-2.aws.neon.tech/Expenses_Tracker?sslmode=require',
    }
  });