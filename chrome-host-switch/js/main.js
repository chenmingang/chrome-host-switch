/**
 *
 */
$(function () {
    init();

    function init(){
        var keys = window.hostData.queryKeys();
        keyObj = JSON.parse(keys);
        var keyHtml = "";

        window.hostData.currentKey='test';//window.hostData.getCurrentHostDataKey();
        console.log(window.hostData.currentKey);
        if (keyObj != null) {
            for (var i = 0; i < keyObj.length; i++) {
                if(window.hostData.currentKey==keyObj[i]){
                    keyHtml += "<li class='btn btn-success'>" + keyObj[i] + "</li>";
                }else{
                    keyHtml += "<li class='btn btn-warning'>" + keyObj[i] + "</li>";
                }
            }
            $("#env-type ul").html(keyHtml);
        }
        var data=window.hostData.queryAllData(keyObj[0]);
        extracted(data);
        var status=window.hostData.getStatus();
        if(status=='on'){
            $("#hostsRemove").attr('class','label label-success');
            $("#hostsRemove").text('开启');
        }else{
            $("#hostsRemove").attr('class','label label-warning');
            $("#hostsRemove").text('关闭');
        }
    }

    function extracted(data) {
        var obj = JSON.parse(data);
        var hosts = "";
        if (obj != null) {
            for (var i = 0; i < obj.length; i++) {
                hosts += obj[i].ip + ' ' + obj[i].domain + '\n';
            }
        }
        $("textarea[name=textAreahost]").val(hosts);
    }

    $("#addKeyBtn").click(function(){
        var key=$("input[name=addKey]").val();
        if(key==null||key==''||key==undefined) return;
        if($("#addKeyBtn").text()=='删除'){
            window.hostData.removeKey(key);
            $("#addKeyBtn").text('添加');
        }else{
            window.hostData.addKey(key);
        }
        init();
    });
    $("input[name=addKey]").keyup(function(){
        var key=$("input[name=addKey]").val();
        console.log(key);
        for (var i = 0; i < keyObj.length; i++) {
            if(key==keyObj[i]){
                $("#addKeyBtn").text('删除');
            }
        }
    });
    $("#env-type ul").on("click","li",function(){
       var key=$(this).text();
        var data=window.hostData.queryAllDataWithKey(key);
        console.log(data);
        window.hostData.currentKey=key;

        extracted(data);
        $("#env-type ul li").attr('class','btn btn-warning');
        $(this).attr('class','btn btn-success');
    });

    $("#hostsSave").click(function(){
        var data=$("textarea[name=textAreahost]").val();
        var hosts = data.split('\n');
        var items = [];
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i].split(' ');
            var item = {};
            item.ip = host[0];
            item.domain = host[1];
            if (item == null || item == undefined || item == '' || item.ip == undefined || item.ip == '' || item.domain == undefined || item.domain == '') continue;
            items.push(item);
        }
        window.hostData.pushAllData(items);
        window.hostData.proxy(items);
        $("#hostsRemove").attr('class','label label-success');
        $("#hostsRemove").text('开启');
        window.hostData.setStatus('on');
        window.hostData.setCurrentHostDataKey(window.hostData.hostDataKey);
    });
    $("#hostsRemove").click(function(){
        $(this).attr('class','label label-warning');
        $(this).text('关闭');
        window.hostData.setStatus('off');
        window.hostData.proxyClean();
    });
});
