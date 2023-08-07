const fs = require('fs')
const util = require('util')
//导入数据库操作模块
const db = require('../dbMysql/index')
const bcrypt = require('bcryptjs')
//导入处理文件上传的包
const formidable = require('formidable')
const path = require('path')
//查询用户信息
exports.getUserInfo = (req, res) => {
  console.log(req.user)
  const sql = 'select username,id,avatar from users where id=?'
  db.query(sql, req.user.id, (err, result) => {
    // console.log(result)
    if (err) {
      return res.cc(err)
    }
    //判断结果是否为空
    if (result.length !== 1) {
      return res.cc('获取用户信息失败')
    }
    //获取用户信息成功
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: result[0]
    })
  })
}
//更新用户信息
exports.updateUserInfo = (req, res) => {
  const userinfo = req.body
  console.log(userinfo)
  const sql = 'update users set ? where id=?'
  db.query(sql, [req.body, req.body.id], (err, result) => {
    if (err) {
      return res.cc(err)
    }
    if (result.affectedRows !== 1) {
      return res.cc('更新用户基本信息失败')
    }
    res.cc('更新用户信息成功', 0)
  })
}
//更改密码
exports.updatePwd = (req, res) => {
  //根据id查询语句
  const sql = 'select * from users where id=?'
  db.query(sql, req.user.id, (err, result) => {
    if (err) {
      return res.cc(err)
    }
    if (result.length !== 1) {
      return res.cc('用户不存在')
    }
    //判断密码是否与数据库中的密码一致
    const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
    if (!compareResult) {
      return res.cc('输入的旧密码错误')
    }

    //更新数据库中的密码
    const newsql = 'update users set password=? where id=?'
    //对新密码进行加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(newsql, [newPwd, req.user.id], (err, result) => {
      if (err) {
        return res.cc(err)
      }
      if (result.affectedRows !== 1) {
        return res.cc('更新密码失败')
      }
      res.cc('更新密码成功', 0)
    })
  })
}

exports.uploadAvatar = (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(__dirname, '/../public/images'),
    //保持文件后缀
    keepExtensions: true
  })
  form.parse(req, (err, fields, files) => {
    if (err) return res.cc(err)
    //服务器保存图片的路径
    let url = '/images/' + files.file.newFilename
    //将图片路径上传至mysql
    const sql = 'update users set avatar=? where id=?'
    db.query(sql, [url, req.user.id], (err, result) => {
      if (err) return res.cc(err)
      console.log('图片数据库上传成功')
      res.send({
        status: 0,
        message: '上传成功',
        imgUrl: url
      })
    })
  })
}
