import { Client } from "https://deno.land/x/postgres@v0.4.4/mod.ts";
// import { Client } from "../deps.js";
// import { Pool } from "../deps.js";
import { config } from "../config/config.js";


// db: use Pool
// const connectionPool = new Pool(config.database, 3);

// const executeQuery = async(query, ...args) => {
//   const client = await connectionPool.connect();
//   try {
//     return await client.query(query, ...args);
//   } catch (e) {
//     console.log(e);
//   } finally {
//     client.release();
//   }

//   return null;
// }

// db: use Client
const client = new Client(config.database);
const executeQuery = async(query, ...args) => {
  try {
      await client.connect();
      return await client.query(query, ...args);
  } catch (e) {
      console.log(e);
  } finally {
      await client.end();
  }
}

export { executeQuery };
