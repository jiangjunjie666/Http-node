const express = require('express')
const router = express.Router()

const personRouterHandler = require('../router_handler/personnel_data')

//获取人员列表信息
//查询用户信息
/**
 * @swagger
 * /person/personList:
 *   get:
 *     summary: 获取人员列表信息
 *     description: 获取人员列表信息，携带token，并使用分页参数`page`和`pageSize`
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         description: 页码
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         required: true
 *         description: 每页条数
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 获取人员列表成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: 状态码
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 人员ID
 *                       name:
 *                         type: string
 *                         description: 人员姓名
 *                       gender:
 *                         type: string
 *                         description: 性别
 *               example:
 *                 status: 200
 *                 message: 获取人员列表成功
 *                 data:
 *                   - id: 1
 *                     name: John Doe
 *                     gender: male
 *       401:
 *         description: 未授权 - 无效或缺失token
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get('/personList', personRouterHandler.getPersonList)

//新增人员接口
router.post('/personAdd', personRouterHandler.addPerson)

//编辑人员接口
router.post('/personEdit', personRouterHandler.editPerson)

//删除人员接口
router.get('/personDel', personRouterHandler.deletePerson)
module.exports = router
