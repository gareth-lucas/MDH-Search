require('dotenv').config();
const bcrypt = require('bcrypt');
const database = require('./helpers/database')();

const runSetup = async () => {

    try {
        console.log("Creating db...");
        const db = await database.fetch();

        db.serialize(function () {
            var drop = `DROP TABLE IF EXISTS users`;
            db.run(drop);

            console.log("Creating user table...")
            var sql = `CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, surname TEXT, password TEXT, lastLogin DATETIME, resetCode TEXT, forceResetOn DATETIME, role TEXT)`;
            db.run(sql, {}, function (err) {
                if (err) {
                    console.error("ERROR:", err);
                }
            });

            console.log("Creating savedSearches table...");
            sql = `CREATE TABLE IF NOT EXISTS savedSearches (idUser TEXT, description TEXT, searchParams TEXT, creationDate DATETIME)`;
            db.run(sql, {}, function (err) {
                if (err) {
                    console.error("ERROR: ", err);
                }
            });

            console.log("Creating administrator account...");
            const pw = bcrypt.hashSync('admin', 10);
            const email = 'admin';
            const name = 'admin';
            const surname = '';
            const lastLogin = null;
            const resetCode = null;
            const forceResetOn = new Date(1970, 01, 01);
            const role = 'ADMIN';
            sql = `INSERT INTO users (email, name, surname, password, lastLogin, resetCode, forceResetOn, role) VALUES ($email, $name, $surname, $pw, $lastLogin, $resetCode, $forceResetOn, $role) ON CONFLICT (email) DO NOTHING`;
            db.run(sql, { $email: email, $name: name, $surname: surname, $lastLogin: lastLogin, $resetCode: resetCode, $pw: pw, $forceResetOn: forceResetOn, $role: role }, function (err) {
                if (err) {
                    console.error("ERROR: ", err);
                }
            });

            console.log("Setup complete!");
        })

    } catch (err) {
        console.error('There was an error which executing the setup script. You may need to create the database manually');
        console.error(err);
    }

}

runSetup();