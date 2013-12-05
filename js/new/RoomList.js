/*
 * 
 * @file     : RoomList.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */
var RoomList = function(config){
    this.config = config;
    this.rooms = [];
    this.maximum = 4;
    this._init();
};

$.extend(RoomList.prototype, {
    _init : function() {
        var me = this, config = me.config;
        for( var i = 0, len = config.length; i < len && i < me.maximum; i++) {
            var room = new Room(config[i], 'roomNo' + i);
            me.rooms.push(room);
        }
        //console.log(me.rooms)
    },
    
    render : function(container) {
        var me = this, parent, fragment = document.createDocumentFragment;
        if(typeof container == 'string') {
            parent = $('#' + parent);
        } else {
            parent = container;
        }
        
        for(var i = 0, len = me.rooms.length; i < len; i++) {
            //console.log(me.rooms[i].dom.outerHTML)
            parent.appendChild(me.rooms[i].dom);
        }
        //parent.append(fragment);
    },
    
    select : function() {
        
    },
    
    next : function() {
        
    }, 
    pre : function() {
        
    }
});
