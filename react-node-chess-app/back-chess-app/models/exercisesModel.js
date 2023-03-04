const connection = require('./database');

class Exercises {
    static async getAllExercises() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM exercises", (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getExerciseById(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM exercises WHERE id = ?", [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async createExercise(exercise) {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO exercises SET ?", exercise, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    static async updateExercise(id, exercise) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE exercises SET ? WHERE id = ?", [exercise, id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async deleteExercise(id) {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM exercises WHERE id = ?", [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }
}

module.exports = Exercises;
