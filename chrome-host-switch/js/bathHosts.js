(function (window) {
    var hostData = {};
    var items=[];
    var hostDataKey="HOST_ADMIN";
    hostData.putData = function (item) {
        for(var i=0;i<items.length;i++){
            if(item.key==items[i].key){
                item.remove(i);
            }
        }
        items.push(item);
        localStorage.setItem(hostDataKey,items);
    }
    hostData.getData = function (key) {
        var items=localStorage.getItem(hostDataKey);
        var item={};
        for(var i=0;i<items.length;i++){
            if(item.key==items[i].key){
                item=items[i];
            }
        }
        return item;
    }



})(window)