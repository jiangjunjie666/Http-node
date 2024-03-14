const db = require('../dbMysql/index')

//获取竞赛列表信息
exports.getCompetitionList = (req, res) => {
  const { page, pageSize, searchKey } = req.query
  //查询总条数
  let total = 0
  const countSql = 'SELECT COUNT(*) AS total FROM t_competition_projects'
  db.query(countSql, (err, count) => {
    if (err) return res.cc(err)
    total = count[0].total
    //查看是否有searchKey
    if (searchKey) {
      //模糊查询
      const searchSql = `SELECT * FROM t_competition_projects WHERE name LIKE '%${searchKey}%' LIMIT ${(page - 1) * pageSize}, ${pageSize}`
      db.query(searchSql, (err, data) => {
        if (err) return res.cc(err)
        //返回相应结果
        res.send({
          code: 200,
          message: '获取竞赛列表成功',
          data,
          total: total
        })
      })
    } else {
      //查询所有的
      const sql = `SELECT * FROM t_competition_projects LIMIT ${(page - 1) * pageSize}, ${pageSize}`
      db.query(sql, (err, data) => {
        if (err) return res.cc(err)
        //返回相应结果
        res.send({
          code: 200,
          message: '获取竞赛列表成功',
          data,
          total: total
        })
      })
    }
  })
}

exports.addCompetition = (req, res) => {
  //拿到需要的参数信息
  const { name, description, creation_date, image } = req.body
  //检验所有的数据存在
  if (!name || !description || !creation_date || !image) {
    return res.cc('缺少参数')
  }
  //插入数据库
  const sql = `INSERT INTO t_competition_projects (name, description, creation_date, image) VALUES ('${name}', '${description}', '${creation_date}', '${image}')`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('添加失败')
    res.send({ code: 200, message: '添加成功' })
  })
}

//修改竞赛信息
exports.editCompetition = (req, res) => {
  //解构需要的数据
  const { id, name, description, creation_date, image } = req.body
  //拼接sql
  const sql = `UPDATE t_competition_projects SET name = '${name}', description = '${description}', creation_date = '${creation_date}', image = '${image}' WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改失败')
    res.send({ code: 200, message: '修改成功' })
  })
}

//删除
exports.delCompetition = (req, res) => {
  const { id } = req.query
  const sql = `DELETE FROM t_competition_projects WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除失败')
    res.send({ code: 200, message: '删除成功' })
  })
}

//获取奖品列表
exports.getAllCompetitionList = (req, res) => {
  const { page, pageSize, searchKeyName, searchKeyComp } = req.query
  // 构建查询条件
  let whereClause = ''
  if (searchKeyName) {
    whereClause += `event_associated = '${searchKeyName}'`
  }
  if (searchKeyComp) {
    if (!whereClause) {
      whereClause += ' winner LIKE "%' + searchKeyComp + '%"'
    } else {
      whereClause += ' and winner LIKE "%' + searchKeyComp + '%"'
    }
  }
  // 执行查询
  const sql = `SELECT COUNT(*) AS total FROM t_award ${whereClause ? 'WHERE ' + whereClause : ''}`
  console.log(sql)
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)

    const total = results[0].total
    // 分页查询奖品列表
    const sqlPage = `SELECT * FROM t_award ${whereClause ? 'WHERE ' + whereClause : ''} LIMIT ${(page - 1) * pageSize}, ${pageSize}`
    console.log(sqlPage)
    db.query(sqlPage, (err, results) => {
      if (err) return res.cc(err)

      res.send({
        code: 200,
        message: '获取奖品列表成功',
        data: results,
        total: total
      })
    })
  })
}

//获取所有的竞赛名称
exports.getAllCompetitionName = (req, res) => {
  const sql = 'select distinct event_associated from t_award'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      code: 200,
      message: '获取竞赛名称成功',
      data: results
    })
  })
}

//新增获奖
exports.addPrize = (req, res) => {
  const { event_associated, prize_name, award_time, prize_image, winner } = req.body
  const sql = `INSERT INTO t_award (event_associated, prize_name, award_time, prize_image, winner) VALUES ('${event_associated}', '${prize_name}', '${award_time}', '${prize_image}', '${winner}')`

  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('添加失败')
    res.send({ code: 200, message: '添加成功' })
  })
}

//修改获奖
exports.editPrize = (req, res) => {
  const { id, event_associated, prize_name, award_time, prize_image, winner } = req.body
  const sql = `UPDATE t_award SET event_associated = '${event_associated}', prize_name = '${prize_name}', award_time = '${award_time}', prize_image = '${prize_image}', winner = '${winner}' WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改失败')
    res.send({ code: 200, message: '修改成功' })
  })
}

//删除获奖
exports.delPrize = (req, res) => {
  const { id } = req.query
  const sql = `DELETE FROM t_award WHERE id = ${id}`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除失败')
    res.send({ code: 200, message: '删除成功' })
  })
}
