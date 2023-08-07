//导入表单验证的包
const Joi = require('joi')

//定义用户名和密码的验证和=规则
const username = Joi.string().alphanum().min(1).max(10).required()
const password = Joi.string()
  .pattern(/^[\S]{6,12}$/)
  .required()

//定义 Id nickname email的验证规则
const id = Joi.number().integer().min(1).required()

//定义头像的验证规则
const avatar = Joi.string().dataUri().required()
//导出
exports.reg_login_schema = {
  body: {
    username,
    password
  }
}
exports.update_userinfo_schema = {
  body: {
    id,
    username
  }
}
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password)
  }
}
exports.update_avatar_schema = {
  body: {
    avatar
  }
}
