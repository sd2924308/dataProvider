var express = require('express');
var router = express.Router();
var comm = require('../common/http');

/* GET home page. */

router.get('/app', function (req, res, next) {
  res.render('downapp', {
    title: '正在更新请稍候'
  });
});

module.exports = router;