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

    //other functions
    static async changePassword(userId, currentPassword, newPassword) {
    return new Promise(async (resolve, reject) => {
        try {
            // Récupérer l'utilisateur avec son ID
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
      
}

module.exports = User;
