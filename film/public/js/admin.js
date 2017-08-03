/**
 * Created by imshichao on 2017/8/3.
 */
$(function(){
    $('.del').click(function(e){
        var target = $(e.target);
        var id=target.data('id');
        var tr=$('.item-id-'+id);


        var rr=confirm("你要删除视频【"+tr.children("td:eq(0)").text()+"】吗？");

        if(rr === true){
            $.ajax({
                type:'DELETE',
                url:"/admin/list?id=" + id
            })
                .done(function (results) {      //done成功时执行
                    if(results.success===1){
                        if(tr.length>0){
                            tr.remove();
                        }
                    }
                })
        }
        else {
            alert("你取消了删除操作。");
        }
    })
})