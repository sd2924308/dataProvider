var mongoose = require('mongoose');

//申明一个mongoons对象
var NewsSchema = new mongoose.Schema({
    cid: String,
    tp: String, //默认0或空 彩票，1体育，2电子 3.金融
    ctitle: String,
    curl: String,
    ctime: String,
    cimg: String,
    intro: String,
    content: String
})

//每次执行都会调用,时间更新操作
// UsersSchema.pre('save', function (next) {
// if (this.isNew) {
//     this.meta.createAt = this.meta.updateAt = Date.now();
// } else {
//     this.meta.updateAt = Date.now();
// }

// next();
// })

//查询的静态方法
NewsSchema.statics = {
    fetch: function (cb) { //查询所有数据
        return this
            .find()
            .sort({
                ctime: -1
            }) //排序
            .exec(cb) //回调
    },
    findById: function (id, cb) { //根据id查询单条数据
        return this
            .findOne({
                cid: id
            })
            .exec(cb)
    },
    findPage: function (page, cb) {
        page = page * 1-1;
        
        var rand =Math.floor(Math.random()*150)+0
        this.find({
                tp: null
            })
            .skip(page * 10 + rand)
            .limit(10)
            .sort({
                _id: -1
            }).exec(cb);
    },
    findPageAndTp: function (page, tp, cb) {
        page = page * 1;
        var c = 150 - 0 + 1;
        var rand = Math.floor(Math.random() * c + 0);
        this.find({
                tp: tp
            })
            .skip(page * 10 + rand)
            .limit(10)
            .sort({
                'ctime': -1
            }).exec(cb);
    }
}

//暴露出去的方法
module.exports = NewsSchema