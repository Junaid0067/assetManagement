// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";
// import pg from 'pg';
import pkg from "pg";
const { Pool } = pkg;

import dotenv from "dotenv";

dotenv.config();
// import { Client } from 'pg';

// neonConfig.webSocketConstructor = ws;

// const con = new pg.Client({
//   host:"localhost",
//   user:"postgres",
//   port:5432,
//   database:"inventory",
//   password:"junaid"
// })

// con.connect().then(()=>{
//   console.log("db connected");
  
// })

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL,ssl: false });
export const db = drizzle({ client: pool, schema });
