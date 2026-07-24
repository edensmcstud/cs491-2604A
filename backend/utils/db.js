const db = require("../database/connection");

// Normalize params defensively
function normalizeParams(params) {
    return Array.isArray(params) ? params : [];
}

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, normalizeParams(params), (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, normalizeParams(params), (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, normalizeParams(params), function (err) {
            if (err) return reject(err);
            resolve(this); // contains lastID + changes
        });
    });
}

module.exports = { query, get, run };
