import * as dotenv from "dotenv";
import { IKeys } from "./interfaces";
dotenv.config();

const keys: IKeys = {
  DATABASE_URL: process.env.DB_URL as string
};

export default keys;
