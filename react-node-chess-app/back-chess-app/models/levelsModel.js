const connection = require('./database');

class Levels {
    static async getAllLevels() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM levels", (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getLevelById(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM levels WHERE id = ?", [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async createLevel(newLevel) {
        const { id_exercise, name, rules, required_elo } = newLevel;
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO levels SET id_exercise = ?, name = ?, rules = ?, required_elo = ?", [id_exercise, name, rules, required_elo], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    static async updateLevel(id, newLevel) {
        const { name, rules, required_elo } = newLevel;
        return new Promise((resolve, reject) => {
            connection.query("UPDATE levels SET name = ?, rules = ?, required_elo = ? WHERE id = ?", [name, rules, required_elo, id], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }


    static async deleteLevel(id) {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM levels WHERE id = ?", [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    // custom
    static async getUnlockableLevels(id_exercise, newElo) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM levels WHERE id_exercise = ? AND required_elo < ?", [id_exercise, newElo], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    // get exercise from level id
    static async getExerciseByLevelId(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT id_exercise FROM levels WHERE id = ?", [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async getLevelByExerciseId(id_exercise) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM levels WHERE id_exercise = ?", [id_exercise], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = Levels;
