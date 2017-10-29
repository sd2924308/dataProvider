var express = require('express');
var router = express.Router();

var SH = require('../models/shenghuo'); //导入模型数据模块

var http = require('http');


//引用url模块，处理url地址相关操作
var comm = require('../common/http');
var fs = require('fs');
//引用cheerio模块,使在服务器端像在客户端上操作DOM,不用正则表达式
var cheerio = require("cheerio");




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/getSH/:page', function (req, res, next) {
  let page = req.params.page
  SH.findPage(page, function (err, s) {
    res.json(s);
  })
})

router.get('/get/:cid', function (req, res, next) {
  let cid = req.params.cid
  SH.findById(cid, function (err, s) {
    res.json(s);
  })
})

router.get('/made', function (req, res, next) {
  getSHData();
  res.send('add ok')
});



function getSHData() {
  let dcount = 0;
  var newsurl = 'http://m.360changshi.com/sh/miaozhao/list_[page].html'
  let pages = 1;
  for (var i = pages; i <= 1; i++) {
    let curUrl = newsurl.replace('[page]', i)
    comm.geturl(curUrl, 'utf-8', function (val) {
      var $ = cheerio.load(val.toString());

      $('.day_tj li').each(function (i, t) {
        let curl = $(t).find('a').attr('href');
        let cimg = $(t).find('img').attr('src');
        let ctitle = $(t).find('h3').text();
        let intro = $(t).find('p').text();
        let ctime = $(t).find('.time').text().replace('• ', '');
        let cid = curl.substring(curl.lastIndexOf('/') + 1);
        cid = cid.substring(0, cid.lastIndexOf('.'));

        SH.findById(cid, function (err, s) {
          if (s) {
            if (!s.content)
              getSHContent(cid, s.curl)
            else
              console.log('已存在');
          } else {
            new SH({
              cid: cid,
              ctitle: ctitle,
              ctime: ctime,
              curl: curl,
              cimg: cimg,
              intro: intro
            }).save(function () {
              //写入成功后，加载内容
              getSHContent(cid, curl)
              console.log('新增' + (++dcount) + '条数据')
            })
          }
        })



      }, this);

      // val = val.replace('try{feed_lotto_2551_1_3596649389618(', '').replace(');}catch(e){};', '')
      // val = JSON.parse(val)
      // val.result.data.forEach(function (element) {
      //   var imgs = '';
      //   if (element.images.length > 0)
      //     imgs = element.images[0].u;
      //   if (imgs && element.wapurl) {
      //     let cid = element.wapurl.substring(element.wapurl.indexOf('if')).substring(0, 15)



      // SH.findById(cid, function (err, s) {
      //   if (s) {
      //     if (!s.content)
      //       getSHContent(cid, s.curl)
      //     else
      //       console.log('已存在');
      //   } else {
      //     new SH({
      //       cid: cid,
      //       ctitle: element.title,
      //       ctime: element.ctime,
      //       curl: element.wapurl,
      //       cimg: imgs,
      //       intro: element.intro
      //     }).save(function () {
      //       //写入成功后，加载内容
      //       getSHContent(cid, element.wapurl)
      //       console.log('新增' + (++dcount) + '条数据')
      //     })
      //   }
      // })
      // }
      // }, this);
    })
  }
}



function getSHContent(id, url) {
  console.log('加载内容..');
  comm.geturl(url, 'utf-8', function (val) {
    var $ = cheerio.load(val.toString());

    $('article a').each(function (i, t) {
      $(t).attr('href', 'javascript:;')
      $(t).html($(t).html().replace('浏览大图', ''));
    })

    c = $('article').html();

    // var chapters = $('body')
    // var c = chapters.find('.c_mainTxtContainer').html();

    SH.update({
      cid: id
    }, {
      content: c
    }, {
      safe: true,
      multi: true
    }, function (err, docs) {
      if (err) console.log(err);
    })
  })
}

module.exports = router;