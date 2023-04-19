const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'blindChessAdmin',
  password: process.env.DB_PASSWORD,
  database: 'chessblinddb'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

module.exports = connection;
