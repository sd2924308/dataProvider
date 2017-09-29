var express = require('express');
var mongoose = require('mongoose');//导入mongoose模块

var Users = require('../models/users');//导入模型数据模块



var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    Users.fetch(function(err, users) {
        if(err) {
            console.log(err);
        }        
        res.json({data: users}) //这里也可以json的格式直接返回数据res.json({data: users});
    })
});


router.get('/add',function(req,res,next){
    new Users({
        name:'pp',
        paw:'pppwd'
    }).save(function(){
        res.send('add ok')
    })
    
})

//查询所有用户数据
router.get('/get', function(req, res, next) {
    Users.fetch(function(err, users) {
        if(err) {
            console.log(err);
        }     
        res.json({data: users})    
        // res.render('index',{title: '用户列表', users: users})  //这里也可以json的格式直接返回数据res.json({data: users});
    })
})
module.exports = router;