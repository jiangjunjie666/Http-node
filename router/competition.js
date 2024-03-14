//竞赛相关的路由
const express = require('express')
const router = express.Router()
const competitionHandler = require('../router_handler/competition.js')

//获取竞赛列表信息
router.get('/list', competitionHandler.getCompetitionList)
//新增竞赛信息
router.post('/add', competitionHandler.addCompetition)
//修改竞赛信息
router.post('/edit', competitionHandler.editCompetition)
//删除竞赛
router.delete('/del', competitionHandler.delCompetition)

//获取竞赛列表
router.get('/allList', competitionHandler.getAllCompetitionList)
//获取所有的竞赛名称
router.get('/allName', competitionHandler.getAllCompetitionName)
//新增获奖
router.post('/addPrize', competitionHandler.addPrize)
//修改获奖
router.post('/editPrize', competitionHandler.editPrize)
//删除获奖
router.delete('/delPrize', competitionHandler.delPrize)
module.exports = router
