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

    static async getEloUserByName(name) {
        return new Promise((resolve, reject) => {
            connection.query("SELECT global_elo FROM users WHERE name = ?", [name], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static async createUser(user) {
        return new Promise((resolve, reject) => {
            const { name, password } = user;
            connection.query("INSERT INTO users SET name = ?, password = ?", [name, password], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async updateNameUser(oldName, newName) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE users SET name = ? WHERE name = ?", [newName, oldName], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async deleteUser(name) {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM users WHERE name = ?", [name], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async updateAvatarUser(name, urlImage) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE users SET imageProfil = ? WHERE name = ?", [urlImage, name], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async changePassword(userId, currentPassword, newPassword) {
        return new Promise(async (resolve, reject) => {
            try {
                // Récupérer l'utilisateur avec son name
                const user = await getUserById(userId);
                // Vérifier que le mot de passe actuel est correct
                const isPasswordCorrect = await comparePassword(currentPassword, user.password);
                if (!isPasswordCorrect) {
                    return reject(new Error('Le mot de passe actuel est incorrect.'));
                }
                // Hasher le nouveau mot de passe
                const hashedPassword = await hashPassword(newPassword);
                // Mettre à jour le mot de passe de l'utilisateur dans la base de données
                const result = await updatePassword(userId, hashedPassword);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    static async changeEloUser(name, points) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE users SET global_elo = global_elo + ? WHERE name = ?", [points, name], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

    static async changeTo0EloUser(name) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE users SET global_elo = 0 WHERE name = ?", [name], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.affectedRows);
            });
        });
    }

}

module.exports = User;
