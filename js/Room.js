(function(window, $){
    var room = function(opt, pos){
        var opt = arguments[0] || {};
        var that = this;
        that.id = opt.id;
        that.name = opt.name;
        that.players = opt.players || [];
        that.foodInfo = opt.foodInfo || [];
        that.wrap = document.createElement('div');
        that.wrap.id = opt.id;
        that.wrap.className = 'room ' + pos;
        
        var players = opt.players, len = players.length;
        if(len == 0) {
            that.wrap.innerHTML = '<div class="available"></div>'
                           + '<div class="available"></div>';
            $(that.wrap).bind('touchstart click', function(){
                game.socket.send('{"dataType":"joinRoom","roomId":"' + that.id  + '"}');
            })
        }
        else if(len == 1) {
            that.wrap.innerHTML = '<div class="roomAvatar1"></div>'
                           + '<div class="available"></div>';
            $(that.wrap).bind('touchstart click', function(){
                game.socket.send('{"dataType":"joinRoom","roomId":"' + that.id  + '"}');
            })
        }else {
            that.wrap.innerHTML = '<div class="roomAvatar1"></div>'
                           + '<div class="roomAvatar2"></div>';
        }
        
        return that.wrap;
    };
    
    E.Room = room;
    
    var avatar = function() {
        
    }
    var prepare = function(roomInfo) {
        this.id = roomInfo.id;
        this.name = roomInfo.name;
        this.players = roomInfo.players;
        this.foodInfo = roomInfo.foodInfo;
    };
    $.extend(prepare.prototype, {
        init : function() {
            var that = this, players = that.players, template = '';
            if(players.length == 1) {
                template = '<div id="firstPlayer"><div class="namebar">' + players[0].playerName + '</div></div>';
            }else {
                template = '<div id="firstPlayer"><div class="namebar">' + players[0].playerName + '</div></div><div id="secondPlayer"><div class="namebar">' + players[1].playerName + '</div></div>';
            }
            E._root.innerHTML = template;
        }
    });
    
    E.Prepare = prepare;
    return;
    
    $.extend(room.prototype, {
        init : function() {
            var that = this,
                rs = that.rooms;
                wrap = document.createElement('div');
            wrap.id = 'roomsWrap';
            that.wrap = wrap;
            if ( rs.length < that.per ) {
                that.per = rs.length
            } else {
                that.next = document.createElement('div');
                that.next.id = '#nextRoom';
                that.pre = document.createElement('div');
                that.pre.id = '#preRoom';
                that.bindEvent();
            }
            that.all = Math.ceil(rs.length / that.per);
            that.render();
        },
        
        render : function() {
            var that = this, rs = that.rooms, template = '';
            for (var i = 0; i < that.per; i++) {
                template +='<div id=' + rs[i] + ' class=room></div>';
            }
            that.wrap.innerHTML = template;
            that.next && that.wrap.appendChild(that.next);
            that.pre && that.wrap.appendChild(that.pre);
            E._root.appendChild(that.wrap);
        },
        
        renderData : function() {
            var that = this;
            
        },
        
        showButton : function() {
            var that = this;
            that.pre.style.display = 'block';
            that.next.style.display = 'block';
            
            that.curr == 0 && ( that.pre.style.display  = 'none');
            that.curr == that.all && ( that.next.style.display  = 'block');
        },
        
        next : function() {
            var that = this;
            that.curr < that.all -1 && that.curr++;
            that.renderData();
            that.showButton();
        }, 
        
        pre : function() {
            var that = this;
            that.curr > 0 && that.curr--;
            that.renderData();
            that.showButton();
        },
        
        bindEvent : function() {
            var that = this;
            $(that.next).bind('touchstart click', that.next);
            $(that.pre).bind('touchstart click', that.pre);
        },
        
        dispose : function() {
            var that = this;
        }
        
    });
    
    E.Room = room;
})(window, $);