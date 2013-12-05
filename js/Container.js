(function(window, $){
    
    var container = function(){
        this.pages = {};
        this.now = 'cover';
        this._init();
        
        this.socket = new WebSocket('ws://172.23.240.61:8080');
        this.room = null;
        this.rooms = [];
    }   
    
    $.extend(container.prototype, {
        _init : function() {
            var that = this, root = E._root;
            //适配
            E._width = E._width > 960 ? 960 : E._width;
            E._height = E._height > 640 ? 640 : E._height;
            $(root).css('width', E._width + 'px')
                   .css('height', E._height + 'px');
            window.scrollTo(0, 1);
            document.addEventListener('touchmove', function(event){event.preventDefault()}, false);
            that._load();
            that._addPage(E.Strategy.pages);
            //that._jumpPage('cover');
        },
        
        _load : function() {
            var that = this, 
                imgs = E._imgsResource;
            var loadbar = new E.LoadBar({
                onProcess : function(rate) {
                    var me = this;
                    me._core.children().css('width', rate * 100 + '%');
                    console.log(rate);
                },
                onAfterEnd : function() {
                    console.log('end');
                    that._jumpPage('cover');
                },
            }, imgs);
            loadbar.start();
            return that;
        },
        
        //换页面
        _addPage : function() {
            var that = this, ps = arguments[0], len = ps.length - 1;
            for (; len >= 0; len--) {
                var page = new E.Page(ps[len]);
                that.pages[page.id] = page;
            };
            return that;
        },
        
        _jumpPage : function(name) {
            var that = this, root = E._root, page = that.pages[name];
            that.pages[that.now].dispose();
            page && (that.now = name) && (page.render());
            return that;
        },
        
        start : function() {
            var that = this;
            that.socket.onmessage = that._WSonMessage;
        },
        //收到数据后
        _WSonMessage : function(evt) {
            var that = this;
            if( !game.id ) {
                game.id = parseInt(evt.data.replace('Connection:', ''));
            }
            var msg = JSON.parse(evt.data);
            //alert(evt.data);
            switch(msg.dataType) {
                case 'addPlayer' :
                    //登陆
                    if(msg.flag == 'Y') {
                        game.socket.send('{"dataType":"getAllRooms"}');
                    }
                    break;
                case 'allRooms' :
                    //显示房间
                    game.rooms = msg.roomInfo;
                    game._jumpPage('room-bg');
                    break;
                case 'joinRoom' :
                    //显示
                    if(msg.flag == 'Y') {
                        
                    }
                    break;
                case 'playerInfo' :
                    if(msg.flag == 'Y') {
                        var players = msg.roomInfo.players,
                            len = players.length;
                        for(var i = 0; i < len; i++) {
                            if(players[i].playerId == game.id) {
                                game.room = new E.Prepare(msg.roomInfo);
                                game._jumpPage('prepare');
                                
                                if(players.length == 2) {
                                    setTimeout(game._jumpPage('play'), 1000);
                                }
                            } 
                        }
                    }
                    break;
                case 'foodInfo' :
                    if(msg.flag == 'Y') {
                        if(game.room.id == msg.roomInfo.id) {
                            msg = msg.roomInfo;
                            var players = msg.players;
                            //alert(players[0].playerId + ' ' + players[1].playerId + ' '+ game.id);
                            if(msg.foodInfo[0].foodNum == 0) {
                                //TODO 游戏结束
                                var r, opt = {};
                                if(players[0].playerId == game.id) {
                                    opt.player1 = players[0].playerName;
                                    opt.player1Num = players[0].foodInfo[0].foodNum;
                                    opt.player2 = players[1].playerName;
                                    opt.player2Num = players[1].foodInfo[0].foodNum;
                                    
                                    if( players[0].foodInfo[0].foodNum >= 5 ) {
                                        r = 'win';
                                    }else{
                                        r = 'lose';
                                    }
                                    
                                }else {
                                    opt.player1 = players[1].playerName;
                                    opt.player1Num = players[1].foodInfo[0].foodNum;
                                    opt.player2 = players[0].playerName;
                                    opt.player2Num = players[0].foodInfo[0].foodNum;
                                    
                                    if( players[1].foodInfo[0].foodNum >= 5 ) {
                                        r = 'win';
                                    }else{
                                        r = 'lose';
                                    }
                                }
                                new E.Result(r, opt);
                                /*
                                alert(evt.data);
                                if( players[0].playerId == game.id ) {
                                    //胜利
                                    alert(2)
                                    players[0].foodInfo[0].foodNum > players[1].foodInfo[0].foodNum;
                                    result = 'win';
                                }else {
                                    players[0].foodInfo[0].foodNum > players[1].foodInfo[0].foodNum;
                                    result = 'win';
                                }
                                alert(3)
                                //失败
                                if( players[1].playerId == game.id ) {
                                    //胜利
                                    alert(4);
                                    players[0].foodInfo[0].foodNum > players[1].foodInfo[0].foodNum;
                                    result = 'lose';
                                }else {
                                    alert(5);
                                    players[0].foodInfo[0].foodNum > players[1].foodInfo[0].foodNum;
                                    result = 'lose';
                                }
                                alert(result);
                                */
                                
                            }
                            //对手加血
                            if( players[0].playerId == game.id) {
                                if ( game.competitor.food < players[1].foodInfo[0].foodNum) {
                                    //alert(game.competitor.food + ' ' + players[1].foodInfo[0])
                                    game.competitor.food = players[1].foodInfo[0].foodNum;
                                    E.Bar.addRight();
                                }
                            }else if(players[1].playerId == game.id) {
                                if ( game.competitor.food < players[0].foodInfo[0].foodNum) {
                                    //alert(game.competitor.food + ' ' + players[0].foodInfo[0])
                                    game.competitor.food = players[0].foodInfo[0].foodNum;
                                    E.Bar.addRight();
                                }
                            } 
                        }
                    }
                    
                case 'roomInfo' :
                    if(msg.flag = 'Y') {
                        if(msg.roomInfo.id = game.room.id) {
                            game.rooms = msg.roomInfo;
                            game._jumpPage('room-bg');
                        }
                    }
                    
            }
        },
        
        login : function() {
            var that = this, opt = arguments[0];
            that.username = {
                id  : opt.id,
                name : opt.name
            }
        },
        
        showRoom : function() {
            var that = this, rooms = that.rooms = arguments[0];
        },
        
        inRoom : function() {
            //显示对手信息，当前的游戏策略
        },
        
        addFood : function() {},
        
        hasEaten : function() {},
        
        end : function() {} 
    });

    E.Container = container;
    
})(window, $);