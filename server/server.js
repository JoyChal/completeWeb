var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var objectID = require('mongodb').ObjectID; // 用來建構MongoDBID物件

// 利用 mongodb 的 driver 宣告一個 MongoClient
var MongoClient = require('mongodb').MongoClient;

// 宣告要連接的主機位置
var uri = 'mongodb://140.112.28.194:27017/b03607036';

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
var port = process.env.PORT || 1337;

var server = http.createServer(function(req, res) {

    // 解析使用者要求的路徑名稱
    let urlData = url.parse(req.url);

    let action = urlData.pathname;

    console.log(action);
    console.log('method:' + req.method);
    let actionlist = action.split('/');
    console.log(actionlist);

    if (/query/i.test(actionlist[1])) { // /query/i:query旁兩個斜線表示我要辨識的東西，i表示不分大小寫
        // 這裡執行資料查詢的動作 (請自行完成)
        // TODO: db.product.find(id) 
        /*db.product.find().toArray(function(err,productList)){
            if(err) throw err;
            db.close;
        }
        */
        var productList = [];
        MongoClient.connect(uri, function(err, db) {
            var collection = db.collection('product');
            // 使用product.collection 進行操作
            collection.find().toArray(function(err, documents) {
                if (err) throw err;
                // 將找到的資料轉為陣列後傳給 productList
                productList = documents;
                // 關閉資料庫連線
                db.close();
                // 資料處理完畢後，開始撰寫回傳值
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // 允許跨頁面js連線
                })
                console.log(JSON.stringify(productList)); // JSON 只是代表一種格式(有key跟value對應的那種)
                res.write(JSON.stringify(productList)); // 將找到的資料陣列轉為JSON格式，並寫入回傳值中
                res.end();

            });
        })

        /*res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(JSON.stringify(productList));
        res.end();*/
    } else if (/delete/i.test(actionlist[1])) {
        var id = actionlist[2];

        console.log(id);
        // 這裡執行刪除資料的動作 (請自行完成)
        // TODO: db.product.delete(id) 
        /*db.product.deleteOne({id:"id"});
         */
        MongoClient.connect(uri, function(err, db) {
            var collection = db.collection('product');
            var newId = new objectID(id); // 將傳回的ID轉為MongoDB之ObjectID物件
            collection.deleteMany({ _id: newId }); // 刪除與此ID相同之物件
            // 再進行一次查詢工作(程式碼同上頁)，回傳最新的資料庫內容……
            var productList = [];
            MongoClient.connect(uri, function(err, db) {
                var collection = db.collection('product');
                // 使用product.collection 進行操作
                collection.find().toArray(function(err, documents) {
                    if (err) throw err;
                    // 將找到的資料轉為陣列後傳給 productList
                    productList = documents;
                    // 關閉資料庫連線
                    db.close();
                    // 資料處理完畢後，開始撰寫回傳值
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' // 允許跨頁面js連線
                    });
                    res.write(JSON.stringify(productList)); // 將找到的資料陣列轉為JSON格式，並寫入回傳值中
                    res.end();

                });
            })
        })


        /*res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(JSON.stringify(id));
        res.end();*/

    } else if (/insert/i.test(actionlist[1]) && /post/i.test(req.method)) {

        // 取得 post 資料
        var data = "";
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            console.log('post data: ' + data);

            // 將 post 資料格式轉成 json
            var product = qs.parse(data);
            console.log(product);
            // 這裡執行插入資料的動作 (請自行完成)
            // TODO: db.product.insert(product)
            /* db.product.insertOne(product);
             */

            // 與查詢程式碼相同
            var productList = [];
            MongoClient.connect(uri, function(err, db) {
                var collection = db.collection('product');
                // 使用product.collection 進行操作
                collection.find().toArray(function(err, documents) {
                    if (err) throw err;
                    // 將找到的資料轉為陣列後傳給 productList
                    productList = documents;
                    // 關閉資料庫連線
                    db.close();
                    // 資料處理完畢後，開始撰寫回傳值
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*' // 允許跨頁面js連線
                    })
                    res.write(JSON.stringify(productList)); // 將找到的資料陣列轉為JSON格式，並寫入回傳值中
                    res.end();

                });
            })


            // 建立MongoDB連線
            MongoClient.connect(uri, function(err, db) {
                // 建立選擇所要操作的collection
                var collection = db.collection('product');
                collection.insertOne({
                    // 插入傳過來的相關資料
                    'name': product.name,
                    'price': product.price,
                    'count': product.count
                });
                // 通知瀏覽器已經寫入完成
                /*res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write("OK!!");
                res.end();*/
            })

            /*res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }); 
            res.write(JSON.stringify(product)); 
            res.end();*/

        })

    } else if (/update/i.test(actionlist[1]) && /post/i.test(req.method)) {
        // 取得 post 資料
        var data = "";
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            console.log('post data: ' + data);

            // 將 post 資料格式轉成 json
            var product = qs.parse(data);

            // 這裡執行更新資料的動作 (請自行完成)
            // TODO: db.product.update(product) 
            // 建立MongoDB連線
            MongoClient.connect(uri, function(err, db) {
                // 建立選擇所要操作的collection
                var collection = db.collection('product');
                // 建立ObjectId物件
                var id = actionlist[2]; // 第一個參數是update, 第二個才是id(見index.js:15)
                var newId = new objectID(id);
                collection.updateOne({ _id: newId }, {
                    $set: {
                        "name": product.name,
                        "price": product.price,
                        "count": product.count
                    }
                });
                // 通知瀏覽器已經寫入完成
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write("OK!!");
                res.end();
            })





            /*res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.write(JSON.stringify(product));
            res.end();*/

        })

    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Server 正常<h1>');
        res.end();
    }

});

// 啟動並等待連接
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);
