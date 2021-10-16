const database = require('../../helpers/database')();
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const emailService = require('../email/email.service');
const interpolate = require('../../helpers/interpolate');
const fs = require("fs").promises;
const path = require("path");

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}

async function getAllUsers() {

    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        db.all(`SELECT rowid, email, name, surname, lastLogin FROM users`, (err, rows) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const results = rows.map(row => {
                return { rowid: row.rowid, email: row.email, name: row.name, surname: row.surname, lastLogin: row.lastLogin }
            });
            resolve(results);
        });
    })

}

async function getUserById(id) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        db.get(`SELECT rowid, email, name, surname, lastLogin, password FROM users WHERE rowid=$rowid`, { $rowid: id }, (err, row) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            if (!row) {
                return resolve();
            }

            resolve({ rowid: row.rowid, email: row.email, name: row.name, surname: row.surname, lastLogin: row.lastLogin, password: row.password });
        });
    })
}

async function getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();
        console.log(email);

        db.get(`SELECT rowid, email, name, surname, lastLogin, password FROM users WHERE email=$email`, { $email: email }, (err, row) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            if (!row) {
                return resolve();
            }

            resolve({ rowid: row.rowid, email: row.email, name: row.name, surname: row.surname, lastLogin: row.lastLogin, password: row.password });
        });
    })

}

async function createUser(data) {

    if (!data.password) {
        data.password = nanoid(16);
    }

    const saltRounds = 5;
    const hashedPw = bcrypt.hashSync(data.password, saltRounds);
    const forceResetOn = new Date(1970, 1, 1);
    const resetCode = null;
    const lastLogin = null;

    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        const sql = `INSERT INTO users (email, name, surname, password, forceResetOn, resetCode, lastLogin ) VALUES ($email, $name, $surname, $password, $forceResetOn, $resetCode, $lastLogin)`;
        db.run(sql, { $email: data.email, $name: data.name, $surname: data.surname, $password: hashedPw, $forceResetOn: forceResetOn, $resetCode: resetCode, $lastLogin: lastLogin }, async (err) => {
            if (err) {
                return reject(err);
            }

            data.site_url = process.env.SITE_URL;
            data.support_email = process.env.SITE_SUPPORT;

            const emailContent = await fs.readFile(path.join(__dirname, '../../templates/welcomeEmail.tpl'), 'utf-8');
            const content = interpolate(emailContent, data);

            const sendTo = process.env.NODE_ENV === 'production' ? data.email : process.env.TEST_EMAIL_RECEIVER;

            await emailService.sendMail({ to: sendTo, from: process.env.SITE_SUPPORT, subject: 'Benvenuto in MDH Search', body: content });

            resolve(await getUserByEmail(data.email));
        });
    })
}

async function updateUser(id, data) {
    return new Promise(async (resolve, reject) => {

        const set = Object.keys(data).map(k => {
            return `${k} = '${data[k]}'`;
        }).join(", ");

        const db = await database.fetch();
        db.run(`UPDATE users SET ${set} WHERE rowid=$rowid`, { $rowid: id }, async (err) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            resolve(await getUserById(id));
        })
    })
}

async function deleteUser(id) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();
        db.run(`DELETE FROM users WHERE rowid=$rowid`, { $rowid: id }, async (err) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            resolve();
        })
    })
}