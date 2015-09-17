(function (window) {
    var hostData = {};
    var items=[];
    hostData.defaultHostDataKey="test";
    var hostDataKey=hostData.defaultHostDataKey;
    if(localStorage.getItem("HOST_ADMIN_KEY")==null){
        var tmp=[];
        tmp.push(hostDataKey);
        localStorage.setItem("HOST_ADMIN_KEY",JSON.stringify(tmp));
    }
    if(localStorage.getItem("currentHostDataKey")==null){
        var tmp=[];
        tmp.push(hostData.defaultHostDataKey);
        localStorage.setItem("currentHostDataKey",JSON.stringify(tmp));
    }

    if(localStorage.getItem("status")==null){
        localStorage.setItem("status",JSON.stringify('off'));
    }

    hostData.setCurrentHostDataKey=function(key){
        localStorage.setItem("currentHostDataKey",JSON.stringify(key));
    }
    hostData.getCurrentHostDataKey=function(){
        return JSON.parse(localStorage.getItem("currentHostDataKey"));
    }

    hostData.setStatus=function(status){
        localStorage.setItem("status",JSON.stringify(status));
    }
    hostData.getStatus=function(){
        return JSON.parse(localStorage.getItem("status"));
    }

    hostData.addKey=function(key){
        var hostDataKeys=localStorage.getItem("HOST_ADMIN_KEY");//类型
        if(hostDataKeys==null||hostDataKeys==undefined){
            hostDataKeys=[];
        } else{
            hostDataKeys=JSON.parse(hostDataKeys);
        }
        hostDataKeys.push(key);
        localStorage.setItem("HOST_ADMIN_KEY",JSON.stringify(hostDataKeys));
    }
    hostData.removeKey=function(key){
        var hostDataKeys=localStorage.getItem("HOST_ADMIN_KEY");//类型
        hostDataKeys=JSON.parse(hostDataKeys);
        var k=undefined;
        var tmp=[];
        for(var i=0;i<hostDataKeys.length;i++){
            if(key!=hostDataKeys[i]){
                tmp.push(hostDataKeys[i]);
                k=hostDataKeys[i];
            }
        }
        localStorage.setItem("HOST_ADMIN_KEY",JSON.stringify(tmp));
        var empty=[];
        localStorage.setItem(key,JSON.stringify(empty));
        if(k==undefined){
            k="test";
        }
        if(JSON.parse(localStorage.getItem("currentHostDataKey"))==key){
            var tmp=[];
            tmp.push(k);
            localStorage.setItem("currentHostDataKey",JSON.stringify(tmp));
            hostData.proxyClean();
        }
    }
    hostData.queryKeys=function(){
        var hostDataKeys=localStorage.getItem("HOST_ADMIN_KEY");//类型
        return hostDataKeys;
    }

    hostData.pushAllDataWithKey=function(items,key){
        hostDataKey=key;
        hostData.pushAllData(items);
        //hostDataKey="HOST_ADMIN";
    }
    hostData.queryAllDataWithKey=function(key){
        hostDataKey=key;
        return hostData.queryAllData();
    }

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