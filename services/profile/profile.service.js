const database = require("../../helpers/database")();

module.exports = {
    getSavedSearchesByUser
}


async function getSavedSearchesByUser(id) {
    return new Promise(async (resolve, reject) => {
        const db = await database.fetch();

        db.all(`SELECT rowid, idUser, description, searchParams FROM savedSearches WHERE idUser=$idUser`, { $idUser: id }, (err, rows) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            const result = rows.map(r => ({
                rowid: r.rowid,
                idUser: r.idUser,
                description: r.description,
                searchParams: r.searchParams
            }));

            resolve(result);


        });
    });
}