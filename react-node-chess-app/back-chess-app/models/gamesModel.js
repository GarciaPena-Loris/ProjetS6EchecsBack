const connection = require('./database');

class Games {
    static async getAllGames() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM games", (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getGameById(id) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM games WHERE id = ?", [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async createGame(game) {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO games SET ?", game, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    static async updateGame(id, game) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE games SET ? WHERE id = ?", [game, id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async deleteGame(id) {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM games WHERE id = ?", [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }
}

module.exports = Games;
