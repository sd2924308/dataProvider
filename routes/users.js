var express = require('express');
var mongoose = require('mongoose'); //导入mongoose模块

var Users = require('../models/users'); //导入模型数据模块



var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    Users.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.json({
            data: users
        }) //这里也可以json的格式直接返回数据res.json({data: users});
    })
});


router.post('/register', function (req, res, next) {

    var loginname = req.body.loginname;
    var pwd = req.body.pwd;
    var phone = req.body.phone || '';
    var email = req.body.email || '';
    var nickName = req.body.nickName || '无名氏';
    var appid = req.body.appid;

    Users.findByName(loginname, appid, function (err, user) {
        if (user != null) {
            res.json({
                code: -1,
                msg: '登录名已经存在'
            })
        } else {
            new Users({
                loginname: loginname,
                pwd: pwd,
                phone: phone,
                email: email,
                nickName: nickName,
                appid: appid
            }).save(function () {
                var data = {
                    code: 200,
                    result: 'success'
                }
                res.json(data)
            })
        }
    })


})

router.post('/login', function (req, res, next) {
    var loginname = req.body.loginname;
    var pwd = req.body.pwd;
    var appid = req.body.appid;
    Users.login(loginname, pwd, appid, function (err, user) {
        if (err) {
            res.json({
                code: 201,
                msg: err
            })
        } else {
            if (user == null)
                res.json({
                    code: -1,
                    msg: '用户名或密码错误'
                })
            else
                res.json({
                    code: 200,
                    result: user
                })
        }
    })

})




//查询所有用户数据
router.get('/getAllUsers', function (req, res, next) {
    Users.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.json({
            data: users
        })
        // res.render('index',{title: '用户列表', users: users})  //这里也可以json的格式直接返回数据res.json({data: users});
    })
})
module.exports = router;