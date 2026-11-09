const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Привет от моего сервера!");
});

app.get("/prices", (req, res) => {
  const rows = db.prepare("SELECT coin, price FROM prices").all();
  let list = rows.map((row) => ({
    coin: row.coin.toUpperCase(),
    price: row.price,
  }));

  const limit = Number(req.query.limit);
  if (limit) {
    list = list.slice(0, limit);
  }

  res.json(list);
});

app.post("/prices", (req, res) => {
  const coin = String(req.body.coin || "").toLowerCase();
  const price = Number(req.body.price);

  if (!coin || !price) {
    res.status(400).json({ error: "Нужны поля coin и price" });
    return;
  }

  db.prepare("INSERT OR REPLACE INTO prices (coin, price) VALUES (?, ?)").run(coin, price);
  res.status(201).json({ coin: coin.toUpperCase(), price });
});

app.get("/price/:coin", (req, res) => {
  const coin = req.params.coin.toLowerCase();
  const row = db.prepare("SELECT coin, price FROM prices WHERE coin = ?").get(coin);

  if (!row) {
    res.status(404).json({ error: "Монета не найдена" });
    return;
  }

  res.json({ coin: row.coin.toUpperCase(), price: row.price });
});

app.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});
