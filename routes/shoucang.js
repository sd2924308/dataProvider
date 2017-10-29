var express = require('express');
var mongoose = require('mongoose'); //导入mongoose模块

var SC = require('../models/shoucang'); //导入模型数据模块



var router = express.Router();


router.post('/add', function (req, res, next) {

    var uid = req.body.uid;
    var nid = req.body.nid;

    SC.findById(uid, nid, function (err, sc) {
        if (sc == null) {
            new SC({
                uid: uid,
                nid: nid
            }).save(function () {
                var data = {
                    code: 200,
                    result: 'add sc'
                }
                res.json(data)
            })
        }else{
            sc.delete()
        }
    })

    res.send('sc ok')
})

module.exports = router;