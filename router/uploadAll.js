// 基础文件的管理路由处理接口
const express = require('express')
const router = express.Router()

const uploadAll_handler = require('../router_handler/uploadAll')

//上传新轮播图图片
router.post('/bannerUpload', uploadAll_handler.bannerUpload)

module.exports = router
