//导入数据库操作模块
const db = require('../dbMysql/index')
//导入加密操作包
const bcrypt = require('bcryptjs')
//导入生成token的包
const jwt = require('jsonwebtoken')
const config = require('../config.js')
//导入生成验证码的包
const svgCaptcha = require('svg-captcha')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
//接口处理函数模块
//注册路由函数
exports.regUser = (req, res) => {
  const userinfo = req.body
  // console.log(userinfo)
  //对表单数据进行合法性判断
  if (!userinfo.username || !userinfo.password) {
    return res.cc('用户名或密码不合法')
  }
  //定义SQL语句 查询用户是否被占用
  const sqlStr = 'select * from t_users where username=?'
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
    const insertSql = 'insert into t_users set ?'
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
// 用户登录
exports.login = (req, res) => {
  const userinfo = req.body
  const { username, password, code } = userinfo
  // console.log(userinfo)
  // 获取生成验证码时存储在 session 中的验证码文本
  const expectedcode = req.session.captcha
  // 检查验证码是否正确
  if (!code || code.toLowerCase() !== expectedcode.toLowerCase()) {
    return res.send({
      status: 1,
      message: '验证码错误'
    })
  }

  // 验证用户名和密码
  const sql = 'select * from t_users where username=?'
  db.query(sql, username, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('登录失败!')

    // 判断密码是否正确
    const compareResult = bcrypt.compareSync(password, result[0].password)
    // console.log(compareResult)
    if (!compareResult) {
      return res.cc('登录失败')
    }

    //查看其状态是否为禁用
    if (result[0].status === 0) {
      return res.cc('账号被禁用')
    }
    //查看是否在线
    if (result[0].online === 1) {
      return res.cc('账号已在线')
    }
    // 生成客户端需要的token
    const user = { ...result[0], password: '', avatar: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expriesIn })

    //将其是否在线修改
    const sql = `update t_users set online = 1 where username = "${username}"`
    db.query(sql, (err, result) => {
      if (err) return res.cc(err)
      if (result.affectedRows !== 1) return res.cc('更新用户状态失败')
    })
    res.send({
      status: 0,
      message: '登录成功',
      data: {
        id: result[0].id,
        username: result[0].username,
        avatar: result[0].avatar,
        status: result[0].status,
        token: 'Bearer ' + tokenStr,
        role: result[0].role,
        authority: result[0].authority
      }
    })
  })
}

exports.captcha = (req, res) => {
  const Captcha = svgCaptcha.createMathExpr({
    width: 110,
    height: 33,
    fontSize: 50,
    background: '#fff', // 背景色
    mathMax: 9,
    mathMin: 1,
    mathOperator: '+'
  })
  // 将验证码文本存储在 session 中
  req.session.captcha = Captcha.text
  // console.log(Captcha.text)
  res.type('svg') // 设置响应类型为 SVG 图片
  res.send(Captcha.data)
}

exports.uploadFile = (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(__dirname, '/../public/images'),
    //保持文件后缀
    keepExtensions: true
  })
  form.parse(req, (err, fields, files) => {
    if (err) return res.cc(err)
    // console.log(fields)
    // console.log(files)
    //服务器保存图片的路径
    let url = '/images/' + files.file.newFilename
    //将图片路径上传至mysql
    res.send({
      status: 0,
      message: '上传成功',
      imgUrl: url
    })
  })
}
//退出登录
exports.logout = (req, res) => {
  const { id, token } = req.body
  //清除token

  const revokedTokens = []
  const revokedTokenPath = path.join(__dirname, '../public/jsonData/revokedToken.json')
  fs.readFile(revokedTokenPath, 'utf-8', (err, data) => {
    if (err) {
      return res.send({
        code: 500,
        message: '退出登录失败'
      })
    }
    revokedTokens.push(...JSON.parse(data))
    revokedTokens.push(token)
    // console.log(revokedTokens)
    //再将文件写入json文件
    fs.writeFile(revokedTokenPath, JSON.stringify(revokedTokens, null, 2) + '\n', (err) => {
      if (err) {
        return res.send({
          code: 500,
          message: '退出登录失败'
        })
      }
      const sql = `update t_users set online=0 where id = "${id}"`
      db.query(sql, (err, result) => {
        if (err) {
          return res.send({
            code: 500,
            message: '退出登录失败'
          })
        }
      })
      res.send({
        code: 200,
        message: '退出登录成功'
      })
    })
  })
}

exports.online = (req, res) => {
  const id = req.query.id
  const sql = `update t_users set online=0 where id = "${id}"`
  db.query(sql, (err, result) => {
    if (err) {
      return res.send({
        code: 500,
        message: '退出登录失败'
      })
    }
    res.send({
      code: 200,
      message: '退出登录成功'
    })
  })
}
