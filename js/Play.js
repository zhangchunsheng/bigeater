(function(window, $){
    var bar = {
        init : function() {
            var wrap = document.createElement('div');
            wrap.className = 'blood-bed';
            var left = document.createElement('div');
            left.className = 'blood-left';
            var right = document.createElement('div');
            right.className = 'blood-right';
            
            this.lDom = $(left);
            this.rDom = $(right);
            
            wrap.appendChild(left);
            wrap.appendChild(right);
            E._root.appendChild(wrap);
            
            this.all = parseInt($(wrap).css('height'));
            this.llength = parseInt(this.lDom.css('height'));
            this.rlength = parseInt(this.rDom.css('height'));
        }, 
        
        addLeft : function() {
            var that = this;
            that.llength += 15;
            if(that.checkEnd()){
                that.lDom.css('height', that.llength + 'px');
            }
            return true;
        },
        
        addRight : function() {
            var that = this;
            that.rlength += 15;
            if(that.checkEnd()){
                that.rDom.css('height', that.rlength + 'px')
                    .css('background-position', '0px ' + ( that.rlength - 168 ) + 'px');
            }
            return true;
        },
        
        checkEnd : function() {
            var that = this;
            if(that.llength + that.rlength >= that.all) {
                return false
            }
            return true;
        }
    };
    E.Bar = bar;
    
    var player = function(type){
        this.id = type
        this.className = '';
        this.init();
        this.start = 0;
        this.gap = 120;
        this.max = 2880;
        
        this.food = 0;
    }
    $.extend(player.prototype, {
        init : function() {
            this.dom = document.createElement('div');
            this.dom.id = this.id;
            this.dom.className = this.className;
            E._root.appendChild(this.dom);
        },
        next : function() {
            this.start += this.gap;
            if( this.start > this.max ) {
                E.Bar.addLeft();
                this.start = 0;
                this.food ++;
                game.socket.send('{"dataType":"updateRoom","roomId":"' + game.room.id + '","foodId":1}');
            }
            $(this.dom).css('background-position', '0px -' + this.start + 'px');
        }
    });
    E.Player = player;
    
    var print = function(type, player){
        this.id = type
        this.className = '';
        this.init();
        this.player = player;
    }
    $.extend(print.prototype, {
        init : function() {
            var that = this;
            that.dom = document.createElement('div');
            that.dom.id = that.id;
            that.dom.className = that.className;
            E._root.appendChild(that.dom);
            
            $(that.dom).bind('touchstart mousedown', function(){
                that.player.next();
            });
        }
    });
    E.Print = print;
    
    var result = function(type, opt){
        this.wrap = document.createElement('div');
        this.wrap.className = 'mask';
        
        this.end = document.createElement('div');
        this.end.className = type;
        
        var opt = opt || {}, template = '';
        this.player1 = opt.player1 || '西建';
        this.player2 = opt.player2 || '郝建';
        this.player1Num = opt.player1Num || 0;
        this.player2Num = opt.player2Num || 0;
        template = '<div class="player1">' + this.player1 + '  吃了' + this.player1Num  + '个</div><div class="player2">' + this.player2 + '  吃了' + this.player2Num  + '个</div>'
        this.end.innerHTML = template;
        
        
        this.again = document.createElement('div');
        this.again.className = 'eatAgain';
        
        $(this.again).bind('touchstart click', function() {
            //game.socket.send('{"dataType":"leaveRoom"}');
        })
        
        this.wrap.appendChild(this.again);
        this.wrap.appendChild(this.end);
        E._root.appendChild(this.wrap);
    };
    E.Result = result;
})(window, $);
