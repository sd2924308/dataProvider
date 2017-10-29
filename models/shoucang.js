var mongoose = require('mongoose')
var ScSchema = require('../schemas/shoucang') //拿到导出的数据集模块
var SC = mongoose.model('collect', ScSchema) // 编译生成Movie 模型

module.exports = SC