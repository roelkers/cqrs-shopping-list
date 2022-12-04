import * as dotenv from "dotenv";
import express from "express";
import path from "path";
import pgClient from "./pgClient";
import router from "./router";

// Express App Setup
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

pgClient.on("error", (error: any) => console.log("Lost PG connection", error));
pgClient.connect(async (err: Error) => {
  app.use(router);
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "../public/index.html"));
  });
  const port = process.env.PORT || 5000 as number;
  app.listen(port, () => {
    console.log("Listening");
  });
});
