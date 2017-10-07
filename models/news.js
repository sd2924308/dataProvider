var mongoose = require('mongoose')
var NewsSchema = require('../schemas/news') //拿到导出的数据集模块
var News = mongoose.model('news', NewsSchema) // 编译生成Movie 模型

module.exports = News