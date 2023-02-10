const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'blindChessAdmin',
  password: 'a/Wad!*NTosbRrS5',
  database: 'chessblinddb'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

module.exports = connection;
