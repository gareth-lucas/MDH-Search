const database = require("../../helpers/database")();

module.exports = {
    getSavedSearchById,
    getSavedSearchesByUser,
    createSavedSearch,
    deleteSavedSearch,
}

async function getSavedSearchById(id) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        db.all(`SELECT rowid, idUser, description, searchParams, creationDate FROM savedSearches WHERE rowid=$rowid`, { $rowid: id }, (err, rows) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const result = rows.map(r => ({
                rowid: r.rowid,
                idUser: r.idUser,
                description: r.description,
                searchParams: r.searchParams,
                creationDate: r.creationDate
            }));

            resolve(result);


        });
    });
}

async function getSavedSearchesByUser(id) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        db.all(`SELECT rowid, idUser, description, searchParams, creationDate FROM savedSearches WHERE idUser=$idUser ORDER BY creationDate DESC`, { $idUser: id }, (err, rows) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const result = rows.map(r => ({
                rowid: r.rowid,
                idUser: r.idUser,
                description: r.description,
                searchParams: r.searchParams,
                creationDate: r.creationDate
            }));

            resolve(result);


        });
    });
}

async function createSavedSearch(id, data) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        const sqlData = {
            $idUser: id,
            $description: data.description,
            $searchParams: data.searchParams,
            $creationDate: new Date()
        }

        db.run(`INSERT INTO savedSearches (idUser, description, searchParams, creationDate) VALUES ($idUser, $description, $searchParams, $creationDate)`, sqlData, async function (err) {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const result = await getSavedSearchById(this.lastID);

            if (result) {
                return resolve(result);
            }

            reject({ message: "Unknown error during savedSearch creation" })

        });
    });
}

async function deleteSavedSearch(id) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        db.run(`DELETE FROM savedSearches WHERE rowid = $rowid`, { $rowid: id }, async function (err) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            return resolve();
        });
    });
}