/**
 *
 */
$(function () {
    init();

    function init(){
        var data=window.hostData.queryAllData();
        var obj=JSON.parse(data);
        var hosts="";
        if(obj!=null){
            for(var i=0;i<obj.length;i++){
                hosts += obj[i].ip+' '+obj[i].domain+'\n';
            }
            $("textarea[name=textAreahost]").val(hosts);
        }
    }
    $("#hostsSave").click(function(){
        var data=$("textarea[name=textAreahost]").val();
        var hosts=data.split('\n');
        var items=[];
        for(var i=0;i<hosts.length;i++){
            var host=hosts[i].split(' ');
            var item={};
            item.ip=host[0];
            item.domain=host[1];
            if(item==null||item==undefined||item==''||item.ip==undefined||item.ip==''||item.domain==undefined||item.domain=='') continue;
            items.push(item);
        }
        window.hostData.pushAllData(items);
        window.hostData.proxy(items);
    });
    $("#hostsRemove").click(function(){
        window.hostData.proxyClean();
    });
});
