const Database = require("better-sqlite3");

const db = new Database("prices.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS prices (
    coin TEXT PRIMARY KEY,
    price REAL NOT NULL
  )
`);

const count = db.prepare("SELECT COUNT(*) AS n FROM prices").get().n;

if (count === 0) {
  const insert = db.prepare("INSERT INTO prices (coin, price) VALUES (?, ?)");
  insert.run("btc", 77500);
  insert.run("eth", 2250);
  insert.run("sol", 96);
}

const total = db.prepare("SELECT COUNT(*) AS n FROM prices").get().n;
console.log("База готова, монет в таблице:", total);

module.exports = db;
