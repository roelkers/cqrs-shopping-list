import express from "express";
import pgClient from "./pgClient";
import router from "./router";
import path from 'path'

// Express App Setup
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

pgClient.connect(async () => {
  pgClient.on("error", () => console.log("Lost PG connection"));
  app.use(router);
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname+'../public/index.html'));
  })
  const port = process.env.PORT || 5000 as number
  app.listen(port, () => {
    console.log("Listening");
  });
});
