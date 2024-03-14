//user路由模块
const express = require('express')
const router = express.Router()

//导入路由处理函数模块
const routerHandler = require('../router_handler/user.js')

//导入验证表单数据中间件
const expressJoi = require('@escook/express-joi')
//导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user.js')
// 生成验证码
router.get('/captcha', routerHandler.captcha)

//编写接口
/**
 * 注册用户
 * @swagger
 * /api/reguser:
 *   post:
 *     summary: 创建一个新用户
 *     description: 使用提供的用户信息注册一个新用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 用户创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 创建成功的消息
 *                 status:
 *                   type: number
 *                   description: 1
 *       400:
 *         description: 登录失败，用户名或密码错误
 *       500:
 *         description: 服务器内部错误，登录失败
 */
router.post('/reguser', expressJoi(reg_login_schema), routerHandler.regUser)
//登录
/**
 * 注册用户
 * @swagger
 * /api/login:
 *   post:
 *     summary: 用户登录并返回token
 *     description: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               code:
 *                 type: string
 *                 description: 验证码
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 登录成功的消息
 *                 status:
 *                   type: number
 *                   description: 0
 *                 token:
 *                   type: string
 *                   description: 登录成功的token
 *       400:
 *         description: 登录失败，用户名或密码错误
 *       500:
 *         description: 服务器内部错误，登录失败
 */
router.post('/login', routerHandler.login)

//添加一个上传文件的接口
router.post('/upload', routerHandler.uploadFile)

//退出登录
router.post('/logout', routerHandler.logout)
//导出路由模块
//设置online为0
router.put('/online', routerHandler.online)
module.exports = router
