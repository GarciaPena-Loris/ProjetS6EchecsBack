const connection = require('./database');

class unlockLevel {
    static async getAllunlockLevel() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM unlock_level", (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getunlockLevelByNameId(id_level, name_user) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM unlock_level WHERE id_level = ? ADN name_user = ?", [id_level, name_user], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async addUnlockLevel(id_level, name_user) {
        const exist = await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM unlock_level WHERE id_level = ? AND name_user = ?", [id_level, name_user], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
        if (exist.length == 0) {
            return new Promise((resolve, reject) => {
                connection.query("INSERT INTO unlock_level VALUES ( ?, ?)", [id_level, name_user], (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
            });
        }
    }

}

module.exports = unlockLevel;
