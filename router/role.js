const express = require('express')

const router = express.Router()

const roleHandler = require('../router_handler/role')

//获取所有管理员的角色信息
router.get('/adminList', roleHandler.getAdminList)
//增加管理员
router.post('/adminAdd', roleHandler.adminAdd)
//删除管理员
router.delete('/adminDel', roleHandler.adminDel)
//编辑管理员
router.post('/adminEdit', roleHandler.adminEdit)
//管理员状态发生变化
router.put('/adminStatus', roleHandler.adminStatus)

//获取角色信息列表
router.get('/roleList', roleHandler.getRoleList)
//获取所有的角色信息列表
router.get('/allRoleList', roleHandler.getAllRoleList)
//编辑角色信息
router.post('/roleEdit', roleHandler.roleEdit)
//新增角色
router.post('/roleAdd', roleHandler.roleAdd)
//删除角色
router.delete('/roleDel', roleHandler.roleDel)
//根据id获取角色的权限信息
router.get('/rolePower', roleHandler.getRolePower)

//对管理员进行角色分配
router.post('/adminRole', roleHandler.adminRole)
//对角色进行权限分配
router.post('/allotRole', roleHandler.allotRole)
module.exports = router
