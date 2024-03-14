//导入数据库
const db = require('../dbMysql/index')
//导入处理文件上传的包
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')
exports.getPersonList = (req, res) => {
  // 查询表中数据，分页查询
  const { page, pageSize, searchKey, genderKey, positionKey, inSchoolKey } = req.query

  const whereArr = []
  if (searchKey) {
    whereArr.push({
      name: 'name',
      key: searchKey
    })
  }
  if (positionKey) {
    whereArr.push({
      name: 'position',
      key: positionKey
    })
  }
  if (genderKey) {
    whereArr.push({
      name: 'gender',
      key: genderKey
    })
  }
  if (inSchoolKey) {
    whereArr.push({
      name: 'is_in_school',
      key: inSchoolKey
    })
  }
  // console.log(whereArr)
  let whereSql = ''
  //筛选需要的条件
  whereArr.forEach((item) => {
    if (whereSql.length !== 0) {
      whereSql += ` and ${item.name} = '${item.key}'`
    } else {
      whereSql += `where ${item.name} = '${item.key}'`
    }
  })
  // 计算正确的偏移量
  const offset = (page - 1) * pageSize
  // console.log(whereSql)
  // 使用参数化查询
  const sql = `SELECT * , (SELECT COUNT(*) FROM t_personnel_data ${whereSql}) as total FROM t_personnel_data ${whereSql} LIMIT ${offset},${pageSize}`
  // console.log(sql)
  db.query(sql, (err, result) => {
    if (err) {
      return res.cc('查询失败')
    }
    if (result.length == 0) {
      return res.send({
        code: 200,
        msg: '查询成功',
        total: 0,
        data: []
      })
    }
    //将total筛选出来
    const dataWithoutTotal = result.map(({ total, ...rest }) => rest)
    res.send({
      code: 200,
      msg: '查询成功',
      total: result[0].total,
      data: dataWithoutTotal
    })
  })
}

//新增接口
exports.addPerson = (req, res) => {
  const personParams = req.body
  const { name, gender, avatar_url, birthday, join_date, position, is_in_school, avatar_url_name } = personParams
  // let resultAvatarUrl = avatar_url.split('/images/')[1]
  // //修改图片文件名称
  // const filePath = path.join(__dirname, `../public/images/personPhoto/${resultAvatarUrl}`)
  // resultAvatarUrl = avatar_url_name + '.' + resultAvatarUrl.split('.')[1]
  // fs.renameSync(filePath, path.join(__dirname, `../public/images/${resultAvatarUrl}`))
  const sql = `insert into t_personnel_data (name,gender,avatar_photo,birthday,join_date,position,is_in_school) values ('${name}','${gender}','${avatar_url}','${birthday}','${join_date}','${position}',${is_in_school})`
  // console.log(sql)
  db.query(sql, (err, result) => {
    if (err) {
      res.cc('新增失败')
    } else {
      res.send({
        code: 200,
        msg: '新增成功'
      })
    }
  })
}

//编辑接口
exports.editPerson = (req, res) => {
  const personParams = req.body
  const { id, name, gender, avatar_url, birthday, join_date, position, is_in_school, avatar_url_name } = personParams
  //根据id修改数据
  // console.log(personParams)
  let resultAvatarUrl = avatar_url.split('/images/')[1]
  //修改图片文件名称
  const filePath = path.join(__dirname, `../public/images/${resultAvatarUrl}`)
  resultAvatarUrl = avatar_url_name + '.' + resultAvatarUrl.split('.')[1]
  if (filePath.split('/images/')[1] !== resultAvatarUrl) {
    fs.renameSync(filePath, path.join(__dirname, `../public/images/${resultAvatarUrl}`))
  }
  const sql = `update t_personnel_data set name = '${name}',gender = '${gender}',avatar_photo = '${resultAvatarUrl}',birthday = '${birthday}',join_date = '${join_date}',position = '${position}',is_in_school = ${is_in_school} where id = ${id}`
  // console.log(sql)
  db.query(sql, (err, result) => {
    if (err) {
      res.cc('编辑失败')
    } else {
      res.send({
        code: 200,
        msg: '编辑成功'
      })
    }
  })
  // res.send('ok')
}

//删除人员
exports.deletePerson = (req, res) => {
  const { id } = req.query
  // console.log(id)
  const sql = `delete from t_personnel_data where id = ${id}`
  // console.log(sql)
  db.query(sql, (err, result) => {
    if (err) {
      res.cc('删除失败')
    } else {
      res.send({
        code: 200,
        msg: '删除成功'
      })
    }
  })
}
