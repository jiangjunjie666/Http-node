const db = require('../dbMysql/index')
//导入处理文件上传的包
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
const config = require('../config')
//处理轮播图文件上传的路由处理函数
exports.bannerUpload = (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(__dirname, '/../public/images/banner'),
    //保持文件后缀
    keepExtensions: true
  })
  form.parse(req, (err, fields, files) => {
    if (err) return res.cc(err)
    console.log(fields)
    const imgurl = config.server + ':' + config.port + '/images/banner/' + files.file.newFilename
    //将图片路径上传至mysql
    const sql = `insert into t_carousel_images (img_url,img_description) values ('${imgurl}','${fields.name}')`
    console.log(sql)
    db.query(sql, (err, result) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '上传成功',
        data: {
          url: imgurl,
          name: fields.name
        }
      })
    })
  })
}
