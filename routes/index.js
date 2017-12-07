var express = require('express');
var router = express.Router();
var comm = require('../common/http');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});


router.get('/shui/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://5597755.com/Lottery_server/get_init_data.php?type=android&appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var b = new Buffer(val.data, 'base64')
    val.data = JSON.parse(b.toString('utf8'))
    val.data.showurl = val.data.show_url;
    res.json(val);
  })
})

router.get('/360tox/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://185.216.248.94:8080/biz/getAppConfig?appid=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var data;
    if (val.success && val.AppConfig) {
      data = '{"kk":' + val.AppConfig.ShowWeb + ',"kks":"' + val.AppConfig.Url + '","menu":0}'
    } else {
      data = '{"kk":0,"kks":"","menu":0}'
    }
    res.send(JSON.stringify(data));
  })
})

router.get('/stoy/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://www.blr6998.com:8585/api/whereis?id=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var f = {
      data: {
        show_url: val.kk,
        url: val.kks
      }
    }
    f.data = JSON.stringify(f.data);
    var b = new Buffer(f.data);
    f.data = b.toString('base64');
    res.json(f);
  })
})


router.get('/sto360/:sid', function (req, res, next) {
  let sid = req.params.sid;
  comm.geturl('http://www.1008188188.com:8585/api/whereis?id=' + sid, 'utf-8', function (val) {
    var val = JSON.parse(val);
    var f = {
      data: {
        show_url: val.kk,
        url: val.kks
      }
    }
    f.data = JSON.stringify(f.data);
    var b = new Buffer(f.data);
    f.data = b.toString('base64');
    res.json(f);
  })
})

var request = require('request'),
  cheerio = require('cheerio'),
  fs = require("fs"),
  browserSync = require("browser-sync").create();

var arryData = [],
  pageNum = 1,
  maxPageNum = 6;

router.get('/zst/:url', function (req, res, next) {
  let url = req.params.url
  url = decodeURIComponent(url);
  console.log(url);
  comm.geturl(url, 'gb2312', function (val) {
    var $ = cheerio.load(val);
    $('.top').remove();
    $('.wrapper').attr('style', 'top:0')
    res.send($.html());
  })
  // res.send('<h1>test</h1>')
})

router.get('/getWaiHui', function (req, res, next) {
  fetchInfo();
  res.send('add ok')
});


// Callback of the simplified HTTP request client
function reqCallback(err, response, body) {
  if (!err && response.statusCode == 200) {
    // 解析数据
    var $ = cheerio.load(body),
      $tr = $('.BOC_main tr'),
      $child = '',
      arryTmp = [],
      i = 1,
      len = $tr.length - 1;

    for (i; i < len; i++) {
      $child = $tr.eq(i).children();

      arryTmp.push(Number($child.eq(1).text())) // 现汇买入
      arryTmp.push(Number($child.eq(2).text())) // 现钞买入
      arryTmp.push(Number($child.eq(3).text())) // 现汇卖出
      arryTmp.push($child.eq(7).text()) // 发布时间

      arryData.push(arryTmp)
      arryTmp = []
    }

    fetchInfo()
  }
}


// 请求数据
function fetchInfo() {
  if (pageNum <= maxPageNum) {
    console.log('读取第' + pageNum + '页数据...');
    request({
      url: 'http://srh.bankofchina.com/search/whpj/search.jsp',
      method: 'POST',
      form: {
        pjname: 1326,
        page: pageNum++
      }
    }, reqCallback)
  } else {
    // 保存数据
    fs.writeFile('./public/data.json', JSON.stringify(arryData), function (err) {
      if (err) throw err;
      console.log('数据保存成功');
    })

    return
  }
}

module.exports = router;