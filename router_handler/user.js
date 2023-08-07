//导入数据库操作模块
const db = require('../dbMysql/index')
//导入加密操作包
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
const config = require('../config.js')

//接口处理函数模块
//注册路由函数
exports.regUser = (req, res) => {
  const userinfo = req.body
  console.log(userinfo)
  //对表单数据进行合法性判断
  if (!userinfo.username || !userinfo.password) {
    // return res.send({
    //   status: 1,
    //   message: '用户名或密码不合法'
    // })
    return res.cc('用户名或密码不合法')
  }
  //定义SQL语句 查询用户是否被占用
  const sqlStr = 'select * from users where username=?'
  db.query(sqlStr, userinfo.username, (err, result) => {
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    //判断用户是否被占用
    if (result.length > 0) {
      // return res.send({ status: 1, message: '用户名已经被占用，请更换其他用户名！' })
      return res.cc('用户名已经被占用，请更换其他用户名！')
    }
    //TODO:用户名可以使用
    //对密码进行加密后存储到数据库  bcryptjs包
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    //插入新用户到数据库中
    const insertSql = 'insert into users set ?'
    db.query(insertSql, { username: userinfo.username, password: userinfo.password }, (err, result) => {
      if (err) {
        //return res.send({ status: 1, message: err.message })
        return res.cc(err)
      }
      //判断影响行数是否为1
      if (result.affectedRows !== 1) {
        //return res.send({ status: 1, message: '注册用户失败，请稍后重试' })
        return res.cc('注册用户失败，请稍后重试')
      }
      //注册用户成功
      //res.send({ status: 0, message: '注册成功！' })
      res.cc('注册成功', 0)
    })
  })
}
//登录路由函数
exports.login = (req, res) => {
  const userinfo = req.body
  console.log(userinfo)
  //定义sql代码 查询数据库是否有该用户
  const sql = 'select * from users where username=?'
  db.query(sql, userinfo.username, (err, result) => {
    console.log(result)
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('登录失败!')
    //TODO 判断密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
    console.log(compareResult)
    if (!compareResult) {
      return res.cc('登陆失败')
    }

    //TODO 生成客户端需要的token
    const user = { ...result[0], password: '', avatar: '' }
    //对用户的信息进行加密 生成token
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expriesIn })
    // console.log(tokenStr)
    //将token响应给客户端
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr //Bearer 为了方便客户端使用token
    })
  })
}
