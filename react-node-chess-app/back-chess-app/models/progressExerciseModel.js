const connection = require('./database');

class ProgressExercise {
    static async getAllProgressExercise() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM progress", (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getProgressExerciseByNameId(UserName, ExerciseId) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM progress WHERE name = ? AND id = ?", [UserName, ExerciseId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async getPointsProgressExerciseByNameId(UserName, ExerciseId) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT points FROM progress WHERE name = ? AND id = ?", [UserName, ExerciseId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async updateProgressExercise(Exercise, UserName, ExerciseId) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE progress SET ? WHERE name = ? AND id = ?", [Exercise, UserName, ExerciseId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async changePointsExercise(ExerciseId, UserName, points) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE progress SET points = points + ? WHERE name = ? AND id = ?", [points, UserName, ExerciseId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

}

module.exports = ProgressExercise;
