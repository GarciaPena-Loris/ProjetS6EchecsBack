const connection = require('./database');

class EloExercise {
    static getAllEloExercise = async () => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM elo_exercise", (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    };

    static getEloExerciseByNameId = async (id_exercise, name_user) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM elo_exercise WHERE name_user = ? AND id_exercise = ?", [name_user, id_exercise], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results[0]);
            });
        });
    };

    static createEloExercise = async (id_exercise, name_user) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO elo_exercise VALUES ( ?, ?, 0)", [id_exercise, name_user], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    };

    static getEloFromEloExerciseBIdyName = async (id_exercise, name_user) => {
        const elo_exercise = await new Promise((resolve, reject) => {
            connection.query("SELECT elo FROM elo_exercise WHERE name_user = ? AND id_exercise = ?", [name_user, id_exercise], (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });

        if (elo_exercise.length > 0) {
            return elo_exercise[0].elo;
        }
        else {
            await this.createEloExercise(id_exercise, name_user);
            return 0;
        }
    };


    static async updateEloExercise(id_exercise, name_user, newElo) {
        return new Promise((resolve, reject) => {
            connection.query(
                "UPDATE elo_exercise SET elo = ? WHERE name_user = ? AND id_exercise = ?", [newElo, name_user, id_exercise], (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result.affectedRows);
                }
            );
        });
    }

}

module.exports = EloExercise;
