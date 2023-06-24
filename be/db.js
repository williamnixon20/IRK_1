const Database = require("better-sqlite3");

// Connect to SQLite database
const db = new Database("history.db");

// Create 'history' table if it doesn't exist
const createTableStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS history (
        timestamp TEXT,
        string TEXT,
        operation TEXT,
        result TEXT
    )
`);
createTableStmt.run();

// Function to save history in the 'history' table
const saveHistory = (string, operation, result) => {
    const timestamp = new Date().toISOString();
    const stmt = db.prepare(
        "INSERT INTO history (timestamp, string, operation, result) VALUES (?, ?, ?, ?)"
    );
    stmt.run(timestamp, string, operation, result);
    console.log("History saved successfully.");
};

const getHistory = (callback) => {
    const stmt = db.prepare("SELECT * FROM history ORDER BY timestamp DESC");
    const rows = stmt.all();
    callback(rows);
};

module.exports = {
    getHistory,
    saveHistory,
};
