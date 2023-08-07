const express = require('express')
const Joi = require('joi')
const app = express()
//引入swagger接口文档配置
const swagger = require('./utils/swagger')
swagger(app)

//配置解析form-data的中间件
// const multer = require('multer')
// 创建一个存储对象，用于设置文件存储的相关配置
// const storage = multer.diskStorage({
//   // 指定文件存储的目录
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   // 指定文件的保存的文件名
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
// // 创建上传对象
// const upload = multer({ storage: storage })

// 使用multer中间件解析form-data数据
// app.use(upload.none())

// app.get('/', (req, res) => {
//   res.send('服务启动成功')
// })

//配置跨域
const cors = require('cors')
app.use(cors())

//配置静态资源
app.use(express.static(__dirname + '/public'))
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false })) //请求时需要加上请求头：application/x-www-form-urlencoded
//封装请求错误函数
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
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
//导入登录注册路由模块
const userRouter = require('./router/user.js')
app.use('/api', userRouter)
//导入用户信息模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
//定义表单数据判断错误级别中间件 （在路由之后）
app.use((err, req, res, next) => {
  //验证失败的错误
  if (err instanceof Joi.ValidationError) {
    return res.cc(err)
  }
  //身份认证失败之后的错误
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败')
  }
  //未知错误
  res.cc(err)
})

app.listen(3000, () => {
  console.log('api server running at http://127.0.0.1:3000')
})
