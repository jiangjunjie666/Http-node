// 基础文件的管理路由处理接口
const express = require('express')
const router = express.Router()

const basics_handler = require('../router_handler/basics')

//获取轮播图数据
router.get('/bannerList', basics_handler.bannerList)

//删除某图片
router.delete('/bannerDel', basics_handler.bannerDel)

//获取basicinform的数据
router.get('/basicInform', basics_handler.basicInform)

//修改basicinform的数据
router.post('/basicInformEdit', basics_handler.basicInformEdit)
module.exports = router
