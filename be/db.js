const sqlite3 = require("sqlite3").verbose();

// Connect to SQLite database
const db = new sqlite3.Database("history.db");

// Create 'history' table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS history (
        timestamp TEXT,
        string TEXT,
        operation TEXT,
        result TEXT
    )
`);

// Function to save history in the 'history' table
const saveHistory = (string, operation, result) => {
    const timestamp = new Date().toISOString();
    db.run(
        "INSERT INTO history (timestamp, string, operation, result) VALUES (?, ?, ?, ?)",
        [timestamp, string, operation, result],
        (err) => {
            if (err) {
                console.error("Error saving history:", err.message);
            } else {
                console.log("History saved successfully.");
            }
        }
    );
};

const getHistory = (callback) => {
    db.all("SELECT * FROM history ORDER BY timestamp desc", (err, rows) => {
        if (err) {
            console.error("Error retrieving history:", err.message);
        } else {
            callback(rows);
        }
    });
};

module.exports = {
    getHistory,
    saveHistory,
};
