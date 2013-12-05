/*
 * 
 * @file     : Room.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */
var Room = function(setting, pos){
    
    this.setting = $.extend({
        id          : '',
        name  : '',
        players     : [],
        foodInfo    : [],
    }, setting);
    this.pos = ['room', pos];
    this.dom = null;
    this.isFull = false;
    this._init();
};
    
$.extend(Room.prototype, {
    _init : function() {
        var me = this, setting = me.setting,
            dom = easyDom(setting.id, me.pos), 
            template = '', players = setting.players, len = players.length;
        for (var i = 0; i  < 2; i ++) {
            if( players[i] ) {
                template += '<div class="roomAvatar1"></div>';
            } else {
                template += '<div class="available"></div>';
            }
        }
        len == 2 && ( me.isFull = true );
        dom.innerHTML = template;
        me.dom = dom;
        //me._event();
        return me;
    },
    
    bind : function(opt) {
        var me = this;
        for( var i in opt ) {
            (function(i) {
                $(me.dom).bind(i, function() {
                    !me.isFull && opt[i].apply(me, arguments);
                })
            })(i);
        }
        return me;
    }
});
