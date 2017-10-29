var mongoose = require('mongoose')
var SHSchema = require('../schemas/shenghuo') //拿到导出的数据集模块
var SH = mongoose.model('shenghuo', SHSchema) // 编译生成Movie 模型

module.exports = SH