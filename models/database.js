const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b82a436c006eb8',
  password: '13e47e2f',
  database: 'heroku_1a3bccc94320ee7'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

module.exports = connection;
