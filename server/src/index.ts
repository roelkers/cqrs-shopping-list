import express from "express";
import pgClient from './pgClient'
import router from './router'

// Express App Setup
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('error', () => console.log('Lost PG connection'));

pgClient.connect(async () => {
  pgClient.on('error', () => console.log('Lost PG connection'));
  app.use(router)
  app.listen(5000, async (err) => {
    console.log("Listening");
    console.log("refresh")
  });

})