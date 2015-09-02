(function (window) {
    var hostData = {};
    var items=[];
    var hostDataKey="HOST_ADMIN";

    hostData.pushAllData=function(items){
        hostData.cleanAllData();
        for(var i=0;i<items.length;i++){
            hostData.putData(items[i]);
        }
    }
    hostData.putData = function (item) {
        items.push(item);
        localStorage.setItem(hostDataKey,JSON.stringify(items));
    }
    hostData.getData = function (key) {
        items=localStorage.getItem(hostDataKey);
        var item={};
        for(var i=0;i<items.length;i++){
            if(key==items[i].key){
                item=items[i];
            }
        }
        return item;
    };
    hostData.queryAllData=function(){
        return localStorage.getItem(hostDataKey);
    };

    hostData.cleanAllData=function(){
        items=[];
        localStorage.setItem(hostDataKey,[]);
        hostData.proxyClean();
    }
    hostData.proxyClean=function(){
        chrome.proxy.settings.set({
            value: {
                mode: 'direct'
            },
            scope: 'regular'
        }, $.noop);
    }
    //设置代理
    hostData.proxy=function(items){
        var script = '';
        for(var i =0;i<items.length;i++){
            var item=items[i];
            if(item.domain.indexOf('*')!=-1){
                script += '}else if(shExpMatch(host,"' + item.domain + '")){';
                script += 'return "PROXY ' + item.ip + ':80; DIRECT";';
            }else if(item.domain.indexOf(':')!=-1){
                var t=item.domain.split(':');
                script += '}else if(shExpMatch(url,"http://' + item.domain + '/*")){';
                script += 'return "PROXY ' + item.ip + ':'+t[1]+'; DIRECT";';
            }else{
                script += '}else if(host == "' + item.domain + '"){';
                script += 'return "PROXY ' + item.ip + ':80; DIRECT";';
            }
            script+="\n";
        }
        var data='function FindProxyForURL(url,host){ \n if(shExpMatch(url,"http:*")){if(isPlainHostName(host)){return "DIRECT";' +
            script + '}else{return "DIRECT";}}else{return "DIRECT";}}';

        chrome.proxy.settings.set({
            value: {
                mode: 'pac_script',
                pacScript: {
                    data:data
                }
            },
            scope: 'regular'
        }, function(){});
    };
    window.hostData = hostData;
})(window)