'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const port =  process.env.PORT || 3000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTION');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Start server
server.listen(port, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined, function() {
  console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});

const orgItems = require('./heroes.json');
var items = orgItems;

app.get('/api/heroes', function(req, res) {
  res.status(200).json(items);
});

app.get('/api/heroes/:id', function(req, res) {
  let id = req.params.id;
  
  const item = items.filter(function(item, index){
    if ((item.id).indexOf(id) >= 0) return true;
  });
  res.status(200).json(item[0]);
});

app.post('/api/heroes', function(req, res) {
  items.push(req.body);
  res.status(200).json();
});

app.put('/api/detail/:id', function(req, res) {
  let id = req.body.id;
  let name = req.body.name;
  
  // for文で使う
  var num;
  // リクエストのidを数値に変換
  var req_num = parseInt(id); 
  // 新しいJSON配列を格納していく
  var newData = [];
  // name を変更する際に使う
  var tempData = [];
  // リクエストのidよりおおきいidのデータを退避する
  var stockData = [];

  for (var i=0; i<items.length; i++) {
    // i番目のitemsのidを数値に変換
    num = parseInt(items[i].id);
    // リクエストのidより処理中のidが小さいときは、そのままnewDataへ
    if (num < req_num) {
      newData.push(items[i]);
    // リクエストのid = 処理中のidのときは、name を更新しnewDataへ
    } else if (num == req_num) {
      var tempData = items.filter(function(item, index){
        if (item.id == id) return true;
      });
      tempData[0].name = name;
      newData.push(tempData[0]);
    // リクエストのidより処理中のidが大きいときは、stockDataへ
    } else {
      stockData.push(items[i]);
    }
  }
  
  // stockDataをnewDataへ
  for (var i=0; i<stockData.length; i++) {
    newData.push(stockData[i]);
  }
  // items を newDataで更新する
  items = newData;
  res.status(200).json();
});

app.delete('/api/heroes/:id', function(req, res) {
  let id = req.params.id;
  items.splice(id, 1);
  res.status(200).json();
});

exports = module.exports = app;
