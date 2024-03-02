const mysql = require('mysql2')
const db = mysql.createConnection({
  host: '127.0.0.1', //118.89.124.134 服务器的ip
  user: 'root', //服务器是 http
  password: 'jjj123456',
  database: 'laboratory' // 服务器是http
})
db.query('select 1', (err, results) => {
  if (err) return console.log(err.message)
  console.log('数据库连接成功')
})

module.exports = db
