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


router.get('/getNews/:page/:tp', function (req, res, next) {
  let page = req.params.page
  let tp = req.params.tp
  News.findPageAndTp(page, tp, function (err, news) {
    res.json(news);
  })
})

router.get('/get/:cid', function (req, res, next) {
  let cid = req.params.cid
  News.findById(cid, function (err, news) {
    res.json(news);
  })
})

router.get('/made/:tp', function (req, res, next) {
  let tp = req.params.tp
  if (tp == 0) //彩票数据
    getSinaData();
  if (tp == 1)
    getSinaDataTY(); //体育数据
  res.send('add ok')
});

//抓取财经数据
router.get('/madecj/:cj', function (req, res, next) {
  let cj = req.params.cj
  getSinaDataCJ(cj); //财经数据
  res.send('add ok')
});


router.get('/initContent', function (req, res, next) {
  refreshNesCount();
  res.send('add ok')
});

router.get('/initContentTY', function (req, res, next) {
  refreshNesCountTY();
  res.send('add ok')
});

router.get('/getSina/:u', function (req, res, next) {
  let u = req.params.u

  if (u && u.indexOf('http') != -1)
    if (u.indexOf('https://') != -1)
      comm.geturlbyhttps(u, 'utf-8', function (val) {
        var data = {
          title: '',
          content: ''
        };
        var $ = cheerio.load(val.toString());
        data.title = $('.art_tit_h1').html() || '';
        $('.art_p').each(function (i, t) {
          if (i != $('.art_p').length - 1)
            data.content += '<p class="art_p">' + $(t).html() || '' + '</p>';
        })
        res.json(data);
      })
  else
    comm.geturl(u, 'utf-8', function (val) {
      var data = {
        title: '',
        content: ''
      };
      var $ = cheerio.load(val.toString());
      data.title = $('.article h1').text() || '';
      data.content = '<p class="art_p">' + $('.article .content').html() || '' + '</p>';
      res.json(data);
    })
  else
    res.json({});
});

router.get('/getSinaBlog', function (req, res, next) {
  let u = 'http://finance.sina.cn/blog?vt=4&pos=102&cid=76524'
  if (u && u.indexOf('http') != -1)
    comm.geturl(u, 'utf-8', function (val) {
      var data = {
        result: {
          data: {
            list: []
          }
        }
      };
      var $ = cheerio.load(val.toString());
      $('.carditems a').each(function (i, t) {
        console.log()
        var img = $(t).children('dl').children('dt').children('img').attr('src');
        var title = $(t).children('dl').children('dd').children('h3').html();
        var URL = $(t).attr('href');
        URL = URL.replace('http://blog.sina.com.cn/s/', 'http://blog.sina.cn/dpool/blog/s/');
        var tmp = {
          title: title,
          URL: URL,
          allPics: {
            pics: [{
              imgurl: img
            }]
          }
        }
        data.result.data.list.push(tmp);
      })
      res.json(data);
    })
  else
    res.json({});
});
// 

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




function getSinaDataTY() {
  let dcount = 0;
  var newsurl = 'http://interface.sina.cn/wap_api/layout_col.d.json?showcid=72264&col=72264&level=1,2,3&show_num=30&page=[page]&act=more'
  let pages = 1;
  for (var i = pages; i <= 33; i++) {
    // for (var i = pages; i <= 1; i++) {
    let curUrl = newsurl.replace('[page]', i)
    let dcount = 0;
    comm.geturl(curUrl, 'utf-8', function (val) {

      val = JSON.parse(val)
      val.result.data.list.forEach(function (el) {

        if (el.allPics.total > 0 && el.mediaTypes == 'normal') {
          var title = el.stitle;
          var cid = 'i' + el._id;
          var imgs = el.allPics.pics[0].imgurl;
          var intro = el.summary;
          var ctime = el.cdateTime;
          var curl = el.URL;
          News.findById(cid, function (err, news) {
            if (news) {
              if (!news.content)
                getNewsContentTY(cid, news.curl)
              else
                console.log('已存在');
            } else {
              new News({
                cid: cid,
                ctitle: title,
                ctime: ctime,
                cimg: imgs,
                intro: intro,
                curl: curl,
                tp: '1'
              }).save(function () {
                //写入成功后，加载内容
                getNewsContentTY(cid, curl)
                console.log('新增' + (++dcount) + '条数据')
              })
            }
          })
        }
      }, this);
    })
  }
}




//获取财经数据
function getSinaDataCJ(cid) {
  let dcount = 0;
  var newsurl = 'https://app5.fx168api.com/news/getNewsByChannel.json?channelId=' + cid + '&appVersion=3.2.3&t=&maxId=&direct=first&pageSize=10&minId=&appCategory=android'
  let pages = 1;
  for (var i = pages; i <= 1; i++) {
    let dcount = 0;
    comm.geturlbyhttps(newsurl, 'utf-8', function (val) {

      val = JSON.parse(val)
      val.data.pager.result.forEach(function (el) {
        var title = el.newsTitle;
        var nid = 'cj' + cid + '_' + el.id;
        var imgs = el.image;
        var ctime = el.publishTime;
        var curl = el.appNewsUrl;
        News.findById(nid, function (err, news) {
          if (news) {
            if (!news.content)
              getNewsContentCJ(cid, nid)
            else
              console.log('已存在');
          } else {
            new News({
              cid: nid,
              ctitle: title,
              ctime: ctime,
              cimg: imgs,
              curl: curl,
              tp: 'cj' + cid
            }).save(function () {
              //写入成功后，加载内容
              getNewsContentCJ(cid, nid)
              console.log('新增' + (++dcount) + '条数据')
            })
          }
        })

      }, this);
    })
  }
}

function getNewsContentCJ(cid, nid) {

  var did = nid.replace('cj' + cid + '_', '');
  comm.geturlbyhttps('https://app5.fx168api.com/news/getNews.json?appCategory=android&appVersion=3.2.3&t=&newsId=' + did, 'utf-8', function (val) {
    var data = JSON.parse(val);
    News.update({
      cid: nid
    }, {
      content: data.data.result.newsContent
    }, {
      safe: true,
      multi: true
    }, function (err, docs) {
      if (err) console.log(err);
      console.log('内容填充');
    })
  })
}

function getNewsContentTY(id, url) {
  if (url.indexOf('https://') != -1) {
    comm.geturlbyhttps(url, 'utf-8', function (val) {
      go(val)
    })
  } else {
    comm.geturl(url, 'utf-8', function (val) {
      go(val)
    })
  }

  function go(val) {
    var $ = cheerio.load(val.toString());
    var c = '';
    var imgs = ''
    if ($('.sharePic') != null) {
      imgs = $('.sharePic').attr('src');
      if (imgs && imgs.indexOf('http:') == -1)
        imgs = 'http:' + imgs;
      c += '<p class="art_p"><img src="' + imgs + '" /></p>';
    }

    $('.art_p').each(function (i, t) {
      if (i != $('.art_p').length - 1)
        c += '<p class="art_p">' + $(t).html() || '' + '</p>';
    })

    News.update({
      cid: id
    }, {
      cimg: imgs,
      content: c
    }, {
      safe: true,
      multi: true
    }, function (err, docs) {
      if (err) console.log(err);
      console.log('内容填充');
    })
  }
}


function refreshNesCountTY() {
  News.fetch(function (err, news) {
    news.forEach(function (element) {
      if (!element.content || element.content == "") {
        if (element.tp == '1')
          getNewsContentTY(element.cid, element.curl)
      }
    }, this);
  })
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