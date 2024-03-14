const express = require('express')
const Joi = require('joi')
const app = express()
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
//引入swagger接口文档配置
const swagger = require('./utils/swagger')
const session = require('express-session')

const db = require('./dbMysql/index')
var cookieParser = require('cookie-parser')

swagger(app)

//配置跨域
// const cors = require('cors')
// app.use(cors())
// 使用 express-session 中间件
app.use(cookieParser())
app.use(
  session({
    secret: 'XiaoMan',
    name: 'xm.session',
    rolling: true,
    cookie: { maxAge: 99999 },
    resave: true, // 添加这一行
    saveUninitialized: true
  })
)

//配置静态资源
app.use(express.static(__dirname + '/public'))
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false })) //请求时需要加上请求头：application/x-www-form-urlencoded
//封装请求错误函数
app.use((req, res, next) => {
  res.cc = function (err, status = 201) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})
//在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))
//除了/api接口不需要token认证以外其他都需要token认证

//判断状态是否为正常状态中间件
// 判断函数中间件
const checkStatus = (req, res, next) => {
  // 在这里判断 req.status 是否为1
  const sql = 'select status from t_users where id=?'
  db.query(sql, req.user.id, (err, result) => {
    if (err) return res.cc(err)

    if (result[0].status !== 1) {
      res.status(401).send('当前账号已被禁用')
      //修改online值
      const sql = `update t_users set online=0 where id = "${req.user.id}"`
      db.query(sql, (err, result) => {
        if (err) return res.cc(err)
      })
    } else {
      next()
    }
  })
}

// 自定义中间件，用于检查令牌是否被撤销
const checkRevoked = (req, res, next) => {
  // 模拟撤销列表
  const revokedTokens = []
  const revokedTokenPath = path.join(__dirname, 'public/jsonData/revokedToken.json')
  fs.readFile(revokedTokenPath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      return next() // 继续执行下一个中间件
    } else {
      try {
        revokedTokens.push(...JSON.parse(data))
        const token = req.headers.authorization + ''
        if (revokedTokens.some((t) => t === token)) {
          // 令牌已经被撤销，拒绝访问
          return res.status(401).send('令牌已经被撤销，拒绝访问')
        }
      } catch (err) {
        console.log(err)
      }
      next() // 继续执行下一个中间件
    }
  })
}
//自定义中间件，接口没被访问一次，就增加一次online值

function trackApiUsage(req, res, next) {
  // 增加调用次数
  //获取当前的时间
  const time = dayjs().format('YYYY-MM-DD')
  //先去查看是否有这个日期的记录
  const sql = `SELECT * FROM t_api_usage WHERE last_updated = '${time}'`
  db.query(sql, (err, result) => {
    if (err) {
      // 处理错误
      console.error(err)
    }
    if (result.length === 0) {
      //如果没有这个日期的记录，就插入一条记录
      const sql = `INSERT INTO t_api_usage (last_updated, count) VALUES ('${time}', 1)`
      db.query(sql, (err, result) => {
        if (err) {
          // 处理错误
          console.error(err)
        }
        // 继续处理请求
        next()
      })
    } else {
      db.query(`UPDATE t_api_usage SET count = count + 1 WHERE last_updated = '${time}'`, (err, result) => {
        if (err) {
          // 处理错误
          console.error(err)
        }
        // 继续处理请求
        next()
      })
    }
  })
}

app.use(trackApiUsage)

//导入登录注册路由模块
const userRouter = require('./router/user.js')
app.use('/api', userRouter)
//导入用户信息模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', checkStatus, userinfoRouter)
//导入人员信息模块
const personRouter = require('./router/personnel_data.js')
app.use('/person', checkStatus, personRouter)
const basicsRouter = require('./router/basics')
app.use('/basics', checkStatus, basicsRouter)
//上传文件的router
const uploadAllRouter = require('./router/uploadAll')
app.use('/api', uploadAllRouter)
//路由权限处理相关的中间件
const roleRouter = require('./router/role')
app.use('/role', checkStatus, roleRouter)
//竞赛路由
const competitionRouter = require('./router/competition')
app.use('/competition', checkStatus, competitionRouter)
//定义表单数据判断错误级别中间件 （在路由之后）
app.use((err, req, res, next) => {
  //验证失败的错误
  if (err instanceof Joi.ValidationError) {
    return res.cc(err)
  }
  //身份认证失败之后的错误
  if (err.name === 'UnauthorizedError' && err.message === 'invalid token') {
    return res.status(401).send('无效的token')
  }
  if (err.name === 'UnauthorizedError' && err.message === 'jwt expired') {
    //将这个用户的是否在线修改为不在线
    return res.status(401).send('token过期')
  }
  //未知错误
  res.cc(err)
  next()
})

app.listen(config.port, () => {
  console.log(`api server running at ${config.server}:${config.port}`)
})
