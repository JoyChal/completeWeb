// 當文件都下載完後執行
$(document).ready(function() {

    var deleteData = function(id) {
        // 刪除資料
        $.get("http://127.0.0.1:1337/delete/" + id, function(data, status) {
            console.log(data);

            // 對 #query 執行 click
            $('#query').click();
        });
    };


    $('#query').on('click', function() {
        // 查詢資料
        $.get("http://127.0.0.1:1337/query", function(data, status) {

            $('tbody').empty();

            for (var i in data) {

                // 宣告需要的DOM元件
                $tdIndex = $('<td>').text(+i + 1);
                $tdName = $('<td>').text(data[i].name);
                $tdPrice = $('<td>').text(data[i].price);
                $tdCount = $('<td>').text(data[i].count);

                $btnUpdate = $('<button>').attr('class', 'btn btn-primary')
                    .text('修改').attr('data-id', data[i].id);
                $btnDel = $('<button>').attr('class', 'btn btn-primary')
                    .text('刪除').attr('data-id', data[i].id);

                $btnUpdate.on('click', function() {
                    // 自行完成修改前端的程式碼
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
});