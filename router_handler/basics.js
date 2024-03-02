const db = require('../dbMysql/index')
const fs = require('fs')
const path = require('path')
//导入config
const config = require('../config')
//获取轮播图的数据
exports.bannerList = (req, res) => {
  const sql = 'select * from t_carousel_images'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '获取轮播图成功',
      data: results
    })
  })
}

exports.bannerDel = (req, res) => {
  const { id, imgUrl } = req.query
  //删除文件夹中的图片
  console.log(imgUrl)
  const filePath = path.join(__dirname, `../public${imgUrl.split(config.server + ':' + config.port)[1]}`)
  console.log(filePath)
  fs.unlink(filePath, (err) => {
    if (err) return res.cc(err)
  })
  //删除数据库中的图片
  const sql = 'delete from t_carousel_images where id = ?'
  db.query(sql, [id], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '删除成功'
    })
  })
}
//获取数据
exports.basicInform = (req, res) => {
  //读取json文件
  const filePath = path.join(__dirname, '../public/jsonData/basicInform.json')
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '成功',
      data: JSON.parse(data)
    })
  })
}

//修改数据
exports.basicInformEdit = (req, res) => {
  //根据id修改json数据
  const filePath = path.join(__dirname, '../public/jsonData/basicInform.json')
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.cc(err)
    const dataJson = JSON.parse(data)
    dataJson.forEach((item) => {
      if (item.id == req.body.id) {
        item.content = req.body.content
      }
    })

    //格式化json文件
    fs.writeFile(filePath, JSON.stringify(dataJson, null, 2) + '\n', (err) => {
      if (err) return res.cc(err)
      res.send({
        code: 200,
        message: '修改成功'
      })
    })
  })
}
