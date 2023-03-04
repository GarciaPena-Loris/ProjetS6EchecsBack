const connection = require('./database');

class ProgressGame {
    static async getAllProgressGame() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM progressgame", (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static async getProgressGameByNameId(UserName, GameId) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM progressgame WHERE name = ? AND id = ?", [UserName, GameId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async getPointsProgressGameByNameId(UserName, GameId) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT points FROM progressgame WHERE name = ? AND id = ?", [UserName, GameId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async updateProgressGame(Game, UserName, GameId) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE progressgame SET ? WHERE name = ? AND id = ?", [Game, UserName, GameId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async changePointsGame(GameId, UserName, points) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE progressgame SET points = points + ? WHERE name = ? AND id = ?", [points, UserName, GameId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

}

module.exports = ProgressGame;
