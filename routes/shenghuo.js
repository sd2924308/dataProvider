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


router.get('/initContent', function (req, res, next) {
  refreshSHCount();
  res.send('add ok')
});


function refreshSHCount() {
  SH.fetch(function (err, shs) {
    shs.forEach(function (element) {
      if (!element.content) {
        getSHContent1(element.cid, element.curl)
      }
    }, this);
  })
}


function getSHData() {
  let dcount = 0;
  var newsurl = 'http://m.changshifang.com/cs/liyi/list_9_[page].html'
  // var newsurl = 'http://m.changshifang.com/shxcs/list_75_[page].html';
  let pages = 1;
  for (var i = pages; i <= 30; i++) {
    let curUrl = newsurl.replace('[page]', i)
    comm.geturl(curUrl, 'gbk', function (val) {
      var $ = cheerio.load(val.toString())
      $('.card_module .f_card').each(function (i, t) {
        let curl = $(t).find('a').attr('href');
        let cimg = $(t).find('img').attr('src');
        let ctitle = $(t).find('h3').text();
        let intro = $(t).find('.f_card_p').text();
        let ctime = $(t).find('.comment').text().replace('时间:', '');
        let cid = curl.substring(curl.lastIndexOf('/') + 1);
        cid = cid.substring(0, cid.lastIndexOf('.'));

        SH.findById(cid, function (err, s) {
          if (s) {
            // if (!s.content)
              getSHContent(cid, s.curl)
            // else
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
    })
  }
}



function getSHData1() {
  let dcount = 0;
  var newsurl = 'http://m.360changshi.com/sh/miaozhao/list_[page].html'
  let pages = 1;
  for (var i = pages; i <= 30; i++) {
    let curUrl = newsurl.replace('[page]', i)
    comm.geturl(curUrl, 'utf-8', function (val) {
      var $ = cheerio.load(val.toString())
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
    })
  }
}



function getSHContent(id, url) {
  console.log('加载内容..');
  url = 'http://m.changshifang.com' + url;
  comm.geturl(url, 'gbk', function (val) {
    var $ = cheerio.load(val.toString());

    $('.article a').each(function (i, t) {
      $(t).attr('href', 'javascript:;')
    })
    $('.article img').each(function (i, t) {
      var url = $(t).attr('src')
      if (url.indexOf('http') == -1)
        url = 'http://m.changshifang.com' + url;
      $(t).attr('src', url)
    })
    c = $('.article').html();

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


function getSHContent2(id, url) {
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



function getSHContent1(id, url) {
  url = url.replace('m.', 'www.');
  console.log(url);
  console.log('加载内容..');
  comm.geturl(url, 'utf-8', function (val) {
    var $ = cheerio.load(val.toString());

    var c = '';
    $('.desc a').each(function (i, t) {
      $(t).attr('href', 'javascript:;')
    })
    $('.desc p').each(function (i, t) {
      c += '<p>' + $(t).html() + '</p>'
    })

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