import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://Accounts:VuPHY1t6cOwa@ep-cool-shape-a5f3tgse.us-east-2.aws.neon.tech/Expenses_Tracker?sslmode=require');
export const db = drizzle(sql,{schema});