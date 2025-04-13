const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'hci-db.cj22yc6yifa0.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'teamandroid123',
  database: 'table_together',
  port: 3306
});

module.exports = db;