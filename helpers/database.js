const sqlite = require('sqlite3');

// database singleton. If the DB is already open, return it, otherwise open it.
const Database = function () {
    var db = null

    const connect = async () => {
        try {

            const _db = new sqlite.Database(process.env.DB_NAME, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
                if (err) {
                    console.error("Unable to create database!", err);
                    throw err;
                }
            });
            return _db;

        } catch (err) {
            console.error(err);
        }
    }

    async function fetch() {
        try {
            if (!db) {
                db = await connect();
            }

            return db;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return {
        fetch: fetch
    }
}

module.exports = Database;