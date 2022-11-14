import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import https from "https";
import bodyParser from "body-parser";
import { connectDb } from "./db";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/static"));
app.use(
  express.static(
    `C:\Users\marij\Desktop\FER\Diplomski\1.semestar\OR\Labosi\lab2\data`
  )
);

const externalURL = process.env.RENDER_EXTERNAL_URL;

const port =
  externalURL && process.env.PORT ? parseInt(process.env.PORT) : 4080;

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/datatable", async function (req, res) {
  res.render("datatable");
});

app.get("/getData", function (req, res) {
  connectDb().then((h) => {
    res.end(h);
  });
});

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  )
  .listen(port, function () {
    console.log(`Server running at https://localhost:${port}/`);
  });
