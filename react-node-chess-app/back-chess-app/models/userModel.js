const connection = require('./database');

class User {
    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM users", (error, results) => {
                if (error) {
                    return reject(error);
                }

                resolve(results);
            });
        });
    }

    static async getUserByName(name) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM users WHERE name = ?", [name], (error, results) => {
                if (error) {
                    return reject(error);
                }

                resolve(results[0]);
            });
        });
    }

    static async createUser(user) {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO users SET ?", user, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    static async updateUser(id, user) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE users SET ? WHERE id = ?", [user, id], (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result.affectedRows);
            });
        });
    }

    static async deleteUser(id) {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM users WHERE id = ?", [id], (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result.affectedRows);
            });
        });
    }
}

module.exports = User;
