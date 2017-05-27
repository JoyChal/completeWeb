// 當文件都下載完後執行
$(document).ready(function() {

    var deleteData = function(id) {
        // 刪除資料
        $.get("http://127.0.0.1:1337/delete/" + id, function(data, status) { // 送到後端，if else那裏判斷要往那兒去
            console.log(data); // function中的 status 是確定連線狀態 。 function只是在說它是一種方法
            // 對 #query 執行 click
            $('#query').click();
        });
    }

    var updateData = function(id, newName, newPrice, newCount) {
        // 更新資料    
        $.post("http://127.0.0.1:1337/update/" + id, { 'name': newName, 'price': newPrice, 'count': newCount }, function(data, status) {
            //             網址                                      {資料}                                                           執行動作
            console.log(data);
            // 重新query以更新頁面
            $('#query').click();
        });
    }

    $('#query').on('click', function() {
        // 查詢資料
        $.get("http://127.0.0.1:1337/query", function(data, status) {

            $('tbody').empty();

            for (var i in data) {

                // 宣告需要的DOM元件  註: $('<td>')是指產生一個<td>
                $tdIndex = $('<td>').text(+i + 1);
                $tdName = $('<td>');
                $tdPrice = $('<td>');
                $tdCount = $('<td>');

                // 按下去之後原本的東西藏起來，input 的輸入塊顯示出來
                //  原本的
                $spanName = $('<span>').text(data[i].name);
                $spanPrice = $('<span>').text(data[i].price);
                $spanCount = $('<span>').text(data[i].count);
                //  input的
                $inputName = $('<input>').attr('type', 'hidden').attr('id', "n_" + data[i]._id);
                $inputPrice = $('<input>').attr('type', 'hidden').attr('id', "p_" + data[i]._id);
                $inputCount = $('<input>').attr('type', 'hidden').attr('id', "c_" + data[i]._id);
                $inputName.val(data[i].name);
                $inputPrice.val(data[i].price);
                $inputCount.val(data[i].count);
                // 把原本的和 input 的append到表格中
                $tdName.append($spanName);
                $tdName.append($inputName);
                $tdPrice.append($spanPrice);
                $tdPrice.append($inputPrice);
                $tdCount.append($spanCount);
                $tdCount.append($inputCount);
                // 接下來定義按表格會發生的事情
                $tdName.on('click', function() { // $tdName是指商品名稱那整行
                    /* $spanName.hide(); // $spanName是變數，會跟著迴圈而不同，所以妳可能無法點在想要的位置有想要的功能
                    $inputName.attr('type', 'text');*/
                    $(this).children().first().hide();
                    $(this).children().last().attr("type", "text");
                })
                $tdPrice.on('click', function() {
                    /*$spanPrice.hide();
                    $inputPrice.attr('type', 'text');*/
                    $(this).children().first().hide();
                    $(this).children().last().attr("type", "text");
                })
                $tdCount.on('click', function() {
                    /*$spanCount.hide();
                    $inputCount.attr('type', 'text');*/
                    $(this).children().first().hide();
                    $(this).children().last().attr("type", "text");
                })

                $btnUpdate = $('<button>').attr('class', 'btn btn-primary')
                    .text('修改').attr('data-id', data[i]._id);
                $btnDel = $('<button>').attr('class', 'btn btn-primary')
                    .text('刪除').attr('data-id', data[i]._id);

                $btnUpdate.on('click', function() {
                    // 自行完成修改前端的程式碼             
                    var id = $(this).attr('data-id'); // 那列btn的資料的id(會都一樣) 
                    var newName = $("#n_" + id).val();
                    var newPrice = $("#p_" + id).val();
                    var newCount = $("#c_" + id).val();
                    updateData(id, newName, newPrice, newCount);

                })

                // 定義刪除按鈕的函式
                $btnDel.on('click', function() {
                    var id = $(this).attr('data-id');
                    deleteData(id);
                })

                // 宣告 tr
                $tr = $('<tr>').append($tdIndex)
                    .append($tdName)
                    .append($tdPrice)
                    .append($tdCount)
                    .append($btnUpdate)
                    .append($btnDel);

                // 將 tr 插入到 tbody
                $('tbody').append($tr);
            }

        });
    });
    /*
    var insertData = function(){

    }
    // 按新增紐不跳轉頁面的寫法
    $('#insertbtn').on('click', function() {
      $.post('http://127.0.0.1:1337/insert');
      var productName = $('#InputProductName').val();
      var productPrice = $('#InputProductPrice').val();
      var productCount = $('#inputProductCount').val();
      if(data == "OK") location.reload(); // 頁面重新整理
      
    })*/
});
