// 基础文件的管理路由处理接口
const express = require('express')
const router = express.Router()

const uploadAll_handler = require('../router_handler/uploadAll')

//上传新轮播图图片
router.post('/bannerUpload', uploadAll_handler.bannerUpload)
//上传竞赛图片
router.post('/competitionUpload', uploadAll_handler.competitionUpload)
//上传成员图片
router.post('/personUpload', uploadAll_handler.personUpload)
//上传获奖图片
router.post('/prizeUpload', uploadAll_handler.prizeUpload)
module.exports = router
