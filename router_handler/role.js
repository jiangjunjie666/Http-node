const db = require('../dbMysql/index')
//导入加密操作包
const bcrypt = require('bcryptjs')
//获取所有的角色权限信息
exports.getRoleList = (req, res) => {
  // 做分页
  const { page, pageSize, searchKey } = req.query

  // 查询总数据条数
  const countSql = 'SELECT COUNT(*) AS total FROM t_role_users'
  db.query(countSql, (countErr, countResults) => {
    if (countErr) return res.cc(countErr)

    const total = countResults[0].total

    if (searchKey) {
      //模糊查询
      const searchSql = `SELECT * FROM t_role_users WHERE name LIKE '%${searchKey}%'`
      db.query(searchSql, (searchErr, searchResults) => {
        if (searchErr) return res.cc(searchErr)
        //判断是否为空
        if (searchResults.length === 0) {
          res.send({
            code: 200,
            message: '没有搜索到相关数据',
            data: null
          })
          return
        }
        res.send({
          code: 200,
          message: '获取角色列表成功',
          data: {
            total: searchResults.length,
            roleList: searchResults
          }
        })
      })
    } else {
      // 查询分页数据
      const dataSql = `SELECT * FROM t_role_users LIMIT ${(page - 1) * pageSize}, ${pageSize}`
      db.query(dataSql, (dataErr, dataResults) => {
        if (dataErr) return res.cc(dataErr)

        res.send({
          code: 200,
          message: '获取角色列表成功',
          data: {
            total,
            roleList: dataResults
          }
        })
      })
    }
  })
}

//获取所有的角色信息列表
exports.getAllRoleList = (req, res) => {
  const sql = `SELECT * FROM t_role_users`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '获取所有角色列表成功',
      data: results
    })
  })
}
//修改用户信息
exports.roleEdit = (req, res) => {
  const { id, name, job } = req.body
  const sql = `UPDATE t_role_users SET name = '${name}',job = '${job}' WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '修改成功'
    })
  })
}

//增加角色
exports.roleAdd = (req, res) => {
  const { name, job } = req.body
  const sql = `INSERT INTO t_role_users (name, job) VALUES ('${name}', '${job}')`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '添加成功'
    })
  })
}

//删除角色
exports.roleDel = (req, res) => {
  const { id } = req.query
  const sql = `DELETE FROM t_role_users WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '删除成功'
    })
  })
}
//获取所有的管理员信息
exports.getAdminList = (req, res) => {
  const { page, pageSize, searchKey } = req.query
  // 查询总数据条数
  const countSql = 'SELECT COUNT(*) AS total FROM t_users'
  db.query(countSql, (countErr, countResults) => {
    if (countErr) return res.cc(countErr)

    const total = countResults[0].total

    if (searchKey) {
      //模糊查询
      const searchSql = `SELECT * FROM t_users WHERE role_name LIKE '%${searchKey}%' LIMIT ${(page - 1) * pageSize}, ${pageSize}`
      db.query(searchSql, (searchErr, searchResults) => {
        if (searchErr) return res.cc(searchErr)

        //判断数据是否为空
        if (searchResults.length === 0) {
          res.send({
            code: 200,
            message: '没有搜索到相关数据',
            data: null
          })
          return
        }
        //将searchResults的数据去除掉password和avatar
        for (let i = 0; i < searchResults.length; i++) {
          delete searchResults[i].password
          delete searchResults[i].avatar
        }
        res.send({
          code: 200,
          message: '获取管理员列表成功',
          data: {
            total,
            roleList: searchResults
          }
        })
      })
    } else {
      // 查询分页数据
      const dataSql = `SELECT * FROM t_users LIMIT ${(page - 1) * pageSize}, ${pageSize}`
      db.query(dataSql, (dataErr, dataResults) => {
        if (dataErr) return res.cc(dataErr)
        for (let i = 0; i < dataResults.length; i++) {
          delete dataResults[i].password
          delete dataResults[i].avatar
        }
        res.send({
          code: 200,
          message: '获取管理员列表成功',
          data: {
            total,
            roleList: dataResults
          }
        })
      })
    }
  })
}

//增加管理员
exports.adminAdd = (req, res) => {
  const { username, password, role_name } = req.body
  console.log(username, password, role_name)
  //判断其用户名是否已经存在
  const sql = `SELECT * FROM t_users WHERE username = '${username}'`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.length > 0) return res.cc('用户名已存在')
    //对密码进行加密
    const password1 = bcrypt.hashSync(password, 10)
    const sql = `INSERT INTO t_users (username, password, role_name) VALUES ('${username}', '${password1}', '${role_name}')`
    console.log(sql)
    db.query(sql, (err, results) => {
      if (err) return res.cc(err)
      res.send({
        code: 200,
        message: '添加管理员成功'
      })
    })
  })
}

//删除管理员
exports.adminDel = (req, res) => {
  const { id } = req.query
  const sql = `DELETE FROM t_users WHERE id = ${id}`
  if (id == 1) {
    return res.cc('不能删除超级管理员')
  }
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '删除成功'
    })
  })
}

//编辑管理员
exports.adminEdit = (req, res) => {
  const { id, username, role_name } = req.body
  const sql = `UPDATE t_users SET username = '${username}', role_name = '${role_name}' WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '修改成功'
    })
  })
}

//管理员状态发生变化
exports.adminStatus = (req, res) => {
  const { id, status } = req.query
  console.log(id, status)
  const sql = `UPDATE t_users SET status = ${status} WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '修改成功'
    })
  })
}

//获取角色的权限信息
exports.getRolePower = (req, res) => {
  const { id } = req.query
  const sql = `SELECT * FROM t_role_users WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '获取角色权限信息成功',
      data: results[0]
    })
  })
}

//对管理员的角色进行分配
exports.adminRole = (req, res) => {
  const { id, roleArr } = req.body
  const arr = roleArr.split(',')
  let roleText = ''

  // 递归函数，用于查询每个角色的权限
  const queryRoles = (index) => {
    if (index >= arr.length) {
      //对roleText进行去重
      // console.log(roleText)
      // roleText = roleText = [...new Set(roleText.split(','))].join(',')
      // console.log(roleText)
      // 所有角色权限查询完成，执行更新操作
      const sql = `UPDATE t_users SET allot_role = '${roleArr}', authority = '${roleText}' WHERE id = ${id}`
      db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
          code: 200,
          message: '分配成功'
        })
      })
      return
    }

    const roleSql = `SELECT * FROM t_role_users WHERE name = '${arr[index]}'`
    db.query(roleSql, (err, results) => {
      if (err) return res.cc(err)
      if (results.length > 0) {
        // 如果查询到角色信息，则将其权限添加到 roleText 中
        roleText += results[0].route_permissions
      }
      // 递归调用查询下一个角色的权限
      queryRoles(index + 1)
    })
  }

  // 开始查询角色权限
  queryRoles(0)
}

//对角色进行权限分配
exports.allotRole = (req, res) => {
  const { id, roleStr } = req.body
  const sql = `update t_role_users set route_permissions = '${roleStr}' where id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '分配成功'
    })
  })
}
