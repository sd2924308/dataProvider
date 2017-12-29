var express = require('express');
var router = express.Router();
var comm = require('../common/http');

/* GET home page. */
router.get('/:url', function (req, res, next) {
  let url = req.params.url
  res.render('fix', {
    title: '修复助手',
    url: url
  });
});


module.exports = router;