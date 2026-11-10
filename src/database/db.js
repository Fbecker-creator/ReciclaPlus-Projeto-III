const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      address2 TEXT,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      items TEXT NOT NULL,
      latitude REAL,
      longitude REAL
    )
  `);

  // Compatibilidade com bancos antigos do projeto.
  db.all(`PRAGMA table_info(places)`, (err, columns) => {
    if (err) return console.error("Erro ao verificar banco:", err);

    const names = columns.map((column) => column.name);

    if (!names.includes("latitude")) {
      db.run(`ALTER TABLE places ADD COLUMN latitude REAL`, (error) => {
        if (error) console.error("Erro ao adicionar latitude:", error);
      });
    }

    if (!names.includes("longitude")) {
      db.run(`ALTER TABLE places ADD COLUMN longitude REAL`, (error) => {
        if (error) console.error("Erro ao adicionar longitude:", error);
      });
    }
  });
});

module.exports = db;
