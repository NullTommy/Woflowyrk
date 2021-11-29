
$('#get_url_btn').click(e => {

    /* 1、生成跳转链接 */
    var base = "https://workflowy.com/#?q=";
    var since = "last-changed-since:";
    var before = "last-changed-before:";
    var tag = "@文档标题";
    var blank = "%20";

    var nowTime = new Date().getTime();
    var ran = Math.ceil(Math.random()*100);

    var sinceDate = new Date();
    var beforeDate = new Date();
    sinceDate.setTime(nowTime-ran * 1000 * 60 * 60 * 24)
    beforeDate.setTime(nowTime-(ran-1) * 1000 * 60 * 60 * 24)
    var sinceDateStr = sinceDate.format("MM/dd/yyyy");
    var beforeDateStr = beforeDate.format("MM/dd/yyyy");
    var endUrl =  base + since + sinceDateStr + blank + before + beforeDateStr + blank  + tag;
    $('#input_result').val(endUrl);

    /* 2、复制到剪贴板 */
    // 创建input元素，给input传值，将input放入html里，选择input
    var w = document.createElement('input');
    w.value = endUrl;
    document.body.appendChild(w);
    w.select();
    // 调用浏览器的复制命令
    document.execCommand("Copy");
    // 将input元素隐藏，通知操作完成！
    w.style.display='none';
    alert("复制成功");
});


Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};
