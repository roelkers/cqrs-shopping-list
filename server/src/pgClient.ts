import keys from "./keys";
import { Pool } from "pg";

const pgClient = 
  new Pool({
    connectionString: keys.DATABASE_URL
  }) 
export default pgClient;
