var express = require('express');
var router = express.Router();

var News = require('../models/news'); //导入模型数据模块

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

router.get('/getNews/:page', function (req, res, next) {
  let page = req.params.page
  News.findPage(page, function (err, news) {
    res.json(news);
  })
})

router.get('/made', function (req, res, next) {
  getSinaData();
  res.send('add ok')
});


router.get('/initContent', function (req, res, next) {
  refreshNesCount();
  res.send('add ok')
});

function getSinaData() {
  let dcount = 0;
  var newsurl = 'http://feed.mix.sina.com.cn/api/roll/get?lid=1761&pageid=192&num=10&page=[page]&fields=wapurl,title,media_name,images,img,comment_show&_=1506609226998&callback=feed_lotto_2551_1_3596649389618'
  let pages = 1;
  for (var i = pages; i <= 100; i++) {
    let curUrl = newsurl.replace('[page]', i)
    let dcount = 0;
    comm.geturl(curUrl, 'utf-8', function (val) {
      val = val.replace('try{feed_lotto_2551_1_3596649389618(', '').replace(');}catch(e){};', '')
      val = JSON.parse(val)
      val.result.data.forEach(function (element) {
        var imgs = '';
        if (element.images.length > 0)
          imgs = element.images[0].u;
        if (imgs && element.wapurl) {
          let cid = element.wapurl.substring(element.wapurl.indexOf('if')).substring(0, 15)

          News.findById(cid, function (err, news) {
            if (news) {
              if (!news.content)
                getNewsContent(cid, news.curl)
              else
                console.log('已存在');
            } else {
              new News({
                cid: cid,
                ctitle: element.title,
                ctime: element.ctime,
                curl: element.wapurl,
                cimg: imgs,
                intro: element.intro
              }).save(function () {
                //写入成功后，加载内容
                getNewsContent(cid, element.wapurl)
                console.log('新增' + (++dcount) + '条数据')
              })
            }
          })
        }
      }, this);
    })
  }
}

function refreshNesCount() {
  News.fetch(function (err, news) {
    news.forEach(function (element) {
      if (!element.content) {
        getNewsContent(element.cid, element.curl)
      }
    }, this);
  })
}

function getNewsContent(id, url) {
  comm.geturl(url, 'utf-8', function (val) {
    var $ = cheerio.load(val.toString());
    var u = $('meta')[17].attribs['content']
    var chapters = $('body')
    var c = chapters.find('.c_mainTxtContainer').html();

    News.update({
      cid: id
    }, {
      content: c
    }, {
      safe: true,
      multi: true
    }, function (err, docs) {
      if (err) console.log(err);
      console.log('内容填充');
    })
  })
}

module.exports = router;