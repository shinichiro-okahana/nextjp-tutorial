// lib/db.ts

import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hoge3hoge4',
  database: 'spring_dev'
});

export default connection;
