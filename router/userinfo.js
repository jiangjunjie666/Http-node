const express = require('express')
const router = express.Router()
//导入处理函数路由模块
const userinfoHandler = require('../router_handler/userinfo')
//导入表单数据验证模块
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user.js')
//挂载路由
//查询用户信息
/**
 * @swagger
 * /my/userinfo:
 *   get:
 *     summary: 获取用户信息
 *     description: 携带token获取用户信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Response message
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: User name
 *                     id:
 *                       type: integer
 *                       description: User ID
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       description: User avatar URL
 *               example:
 *                 status: 0
 *                 message: 获取用户信息成功
 *                 data:
 *                   username: zs
 *                   id: 2
 *                   avatar: null
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/userinfo', userinfoHandler.getUserInfo)
//更新用户信息
//更新用户信息的swagger接口注释
/**
 * 更新用户信息
 * @swagger
 * /my/updateUserinfo:
 *   post:
 *     summary: 更新用户信息
 *     description: 更新用户信息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: 用户ID
 *               username:
 *                 type: string
 *                 description: 用户名
 *     responses:
 *       200:
 *         description: 更新用户信息成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: 更新用户信息失败
 *       500:
 *         description: 服务器内部错误
 * security:
 *   - bearerAuth: []  # 将 security 定义移至根节点
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/updateUserinfo', expressJoi(update_userinfo_schema), userinfoHandler.updateUserInfo)
//修改密码
//修改密码的swagger接口注释
/**
 * 修改用户密码
 * @swagger
 * /my/updatepwd:
 *   post:
 *     summary: 修改用户密码
 *     description: 修改用户密码
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               oldPwd:
 *                 type: string
 *                 description: 原密码
 *               newPwd:
 *                 type: string
 *                 description: 新密码
 *     responses:
 *       200:
 *         description: 修改用户密码成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: 修改用户密码失败
 *       500:
 *         description: 服务器内部错误
 * security:
 *   - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/updatepwd', expressJoi(update_password_schema), userinfoHandler.updatePwd)
//处理文件上传,此案例更新为更新用户的头像
//此swagger接口注释为更新用户的头像
/**
 * @swagger
 * /my/uploadAvatar:
 *   post:
 *     summary: 更新用户头像
 *     description: 更新用户头像
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: file
 *                 description: 用户头像
 *     responses:
 *       200:
 *         description: 上传用户头像成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *               example:
 *                 status: 0
 *                 message: 上传用户头像成功
 *       400:
 *         description: 上传用户头像失败
 *       500:
 *         description: 服务器内部错误
 * security:
 *   - bearerAuth: []
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/uploadAvatar', userinfoHandler.uploadAvatar)

//导出路由
module.exports = router
