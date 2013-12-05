/*
 * 
 * @file     : GameSocket.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */

var GameSocket = function(game, setting) {
    this.setting = $.extend({
        url     : 'ws://localhost:8080',
        fns     : {}
    }, setting);
    this.socket = new WebSocket(this.setting.url);
    this.game = game;
    this.fns = this.setting.fns;
    this._init();
}

$.extend(GameSocket.prototype, {
    _init : function() {
        var me = this; 
        //fns = me.setting.fns;
       // me.addFns(fns);
        me.socket.onmessage = function(evt) {
            me.methods.call(me, evt);
        }
    },
	
    addFns : function(fns) {
        var me = this;
        for( var i in fns ) {
            me.fns[i] = fns[i];
        }
    },
    
    methods : function( evt ) {
        var me = this,
            fns = me.fns, game = me.game;
        if( !game.id ) {
            game.id = parseInt(evt.data.replace('Connection:', ''));
            return;
        }
        var msg = JSON.parse(evt.data);
        //console.log(msg);
        for( i in fns ) {
            i == msg.dataType && fns[i].call(me.game, msg);
        }
    },
    
    send : function( data ) {
        var me = this;
        me.socket.send(data);
    }
});
