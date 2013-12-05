/*
 * 
 * @file     : Game.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */
var Game = function(setting) {
    this.setting = $.extend({
        curr    : 'cover',
        imgsSrc : [],           //所需图片列表
    }, setting);
    this.id = null;
    this.pages = {};    //game page
    //this.room = null;
    this.roomList = null;   //  game rooms
    this.play = null;       // when players begins, it runs
    this.socket = new GameSocket(this, {});
    this._init();
};

$.extend(Game.prototype, {
    constructor     : Game,
    /*
     *  主要进行屏幕适配
     */
    _init : function(){
        var me = this;
        
    },
    _event : function() {
        var me = this,
            page = me.pages[me.setting.curr],
            comps = page.components,
            events, active;
        for( var i in comps) {
            events = comps[i].setting.events;
            active = comps[i].setting.active;
            for( var j in events ) {
                (function(i, j, events, active){
                    //console.log(comps[i].setting.id + ' ' + j);
                    $(comps[i].dom).bind(j, function(){
                        active && events[j].call(me);
                    });
                })(i, j, events, active)
            }
        }
    },
    /*
     *  预加载图片
     */
    _preLoad        : function(){
        var me = this, setting = me.setting;
            imgs = setting.imgsSrc,
            loadbar = new LoadBar({
                onProcess : function(rate) {
                    var me = this;
                    me._core.children().css('width', rate * 100 + '%');
                    //console.log(rate);
                },
                onAfterEnd : function() {
                    //console.log('end');
                    me.jumpPage(setting.curr);
                },
            }, me.setting.imgsSrc);
        loadbar.start();
        return me;
    },
    /*
     * 开始游戏
     */
    start : function(){
        var me = this;
        me._preLoad();
    },
    /*
     * 增加游戏页面
     */
    addPages : function(){
        var me = this, ps = arguments[0], len = ps.length - 1;
        for (; len >= 0; len--) {
            var page = new Page(ps[len]);
            me.pages[page.id] = page;
        };
        return me;
    },
    /*
     * 游戏页面跳转
     */
    jumpPage : function(name){
        var me = this, page = me.pages[name],
            setting = me.setting;
        me.pages[setting.curr].dispose();
        page && (setting.curr = name) && (page.render()) && me._event();
        return me.pages[name];
    },
    /*
     * 获取游戏页面
     */
    getPage : function( name ) {
        var me = this, pages = me.pages;
        return pages[name];
    },
    
    /*
     * 增加socket方法
     */
    addSocketMethods : function() {
        var me = this, fns = arguments[0];
        if( !fns ) return;
        for( var i in fns ) {
            me.socket.addFns(fns);
        }
    },
    
    /*
     * 增加房间
     */
    addRooms : function(config) {
        var me = this, room, rooms;
        me.roomList = new RoomList(config);
        rooms = me.roomList.rooms;
        for( var i = 0, len = rooms.length; i < len; i++) {
            room = rooms[i];
            room.bind({'touchstart click' : function() {
                me.socket.send('{"dataType":"joinRoom","roomId":"' + this.setting.id  + '"}');
            }})
        }
    },
    
    /*
     * 判断是否是自己
     */
    isMyself : function() {
        var me = this, argu = arguments[0];
        if( typeof argu == 'string') return me.id == argu;
        for( var i = 0, len = argu.length; i < len; i++) {
            if(argu[i].playerId == me.id) return true;
        }
        return false;
    },
    /*
     * 进入房间
     */
    enterRoom : function( config, callback) {
        var me = this, page = me.jumpPage('prepare'),
            players = config.players,
            template = '';
        //TODO use RoomList
        if( players.length == 1 ) {
            template = '<div id="firstPlayer"><div class="namebar">' + players[0].playerName + '</div></div>';
        }else {
            template = '<div id="firstPlayer"><div class="namebar">' + players[0].playerName + '</div></div><div id="secondPlayer"><div class="namebar">' + players[1].playerName + '</div></div>';
            //me.play = new Play( config );
            callback && callback.apply(me);
        }
        var temp = easyDom('temp');
        temp.innerHTML = template;
        ROOT.appendChild(temp.childNodes[0]);
        temp.childNodes[0] && ROOT.appendChild(temp.childNodes[0]);
        //players.length == 2 && me.readyToPlay(config);
    },
    
    readyToPlay : function(config){
        var me = this, loop, count = 0;
        loop = setInterval(function(){
            if( count == 3 ) {
                me.jumpPage('play');
                me.play = new Play( me.id, config );
                me.play.start();
            }
            count++;
        }, 1000);
    }
});
