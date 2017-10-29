var mongoose = require('mongoose');

//申明一个mongoons对象
var ScSchema = new mongoose.Schema({
    nid: String,
    uid: String
})

//每次执行都会调用,时间更新操作
// UsersSchema.pre('save', function (next) {
//     if (this.isNew) {
//         this.meta.createAt = this.meta.updateAt = Date.now();
//     } else {
//         this.meta.updateAt = Date.now();
//     }
//     next();
// })

//查询的静态方法
ScSchema.statics = {
    findById: function (uid,nid, cb) { //根据id查询单条数据
        return this
            .findOne({
                nid: nid,
                uid: uid
            })
            .exec(cb)
    }
}

//暴露出去的方法
module.exports = ScSchema