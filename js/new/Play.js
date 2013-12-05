/*

*/
var Play = function( id, info ) {
    this.info = info;
    this.id = id;
    this.roomId = info.id;
    this.players = info.players || [];
    this.foodInfo = info.foodInfo || [];
    this.vertical = WIDTH > 960 ? 'false' : 'true';
    this._init();
};

$.extend(Play.prototype, {
    _init : function() {
        var me = this;
        me.bar = new Bar();
        for( var i = 0, len = me.players; i < len; i++) {
            me.players[i].id == me.id ? ( my.self = new Player({
                id          :   me.players[i].id,
                name        :   me.players[i].playerName,
                avatar      :   me.players[i].avatar
            })) : ( my.competitor = new Player({
                id      :   me.players[i].id,
                name    :   me.players[i].playerName,
                avatar  :   me.players[i].avatar
            }))
        }
        me.competitor = new Player({
            id          : 'rightAvatar',
            playerName  : '',
            className   : 'avatar2'
        });
        me.area = new Area();
    },
    
    update : function( msg ) {
        var me = this;
        //分支1，游戏结束
        if( me._result ) {
            me.end();
            return;
        }
        this.players = msg.players;
        this.foodInfo = msg.foodInfo;
        console.log(msg);
    },
    
    start : function() {
        var me = this;
        me.bar.render();
        me.self.render();
        me.competitor.render();
        me.area.render();
    },
    
    end : function() {
        
    }
});
/*
 *  食槽
*/
var Bar = function() {
    this.wrap = easyDom(['blood-bed']);
    this.left = easyDom(['blood-left']);
    this.right = easyDom(['blood-right']);
    this.dir = WIDTH > 960 ? 'width' : 'height';
    
    this.wrap.appendChild( this.left );
    this.wrap.appendChild( this.right );
    //ROOT.appendChild(wrap);
    
    this.all = parseInt( this.wrap.style[this.dir] );
    this.llength = parseInt( this.left.style[this.dir] );
    this.rlength = parseInt( this.right.style[this.dir] );
}

$.extend(Bar.prototype, {
    _init : function() {
        
    },
    
    render : function() {
        ROOT.appendChild( this.wrap );
    },
    
    checkEnd : function() {
        var me = this;
        if( me.llength + me.rlength >= me.all ) {
            return false;
        }
        return true;
    },
    
    addLeft : function() {
        var me = this;
        me.llength += 15;
        me.checkEnd() && me.lDom.css( me.dir, me.llength + 'px');
    },
    
    addRight : function() {
        var me = this
    }
});
/*
    avatar
*/
var Player = function( config ) {
    this.config = config;
    this.avatar = easyDom( config.id, [config.className] );
    this.name = easyDom( [config.playerName] );
    //this.animate = easyDom( config.animate );
};
$.extend( Player.prototype, {
    _init :  function() {
        
    },
    render : function() {
        var me = this;
        ROOT.appendChild( me.avatar );
        ROOT.appendChild( me.name );
        //ROOT.appendChild( me.animate );
    }
});
/*
    操作区域
*/
var Area = function() {
    this._init();
    this.frame = 
};
$.extend( Area.prototype, {
    _init : function() {
        this.left = easyDom('leftPrint');
        this.right = easyDom('rightPrint');
    },
    event : function( callback ) {
        var me = this;
        $( me.left ).bind('click', function() {
            callback && callback();
        });
        $( me.right ).bind('click', function() {
            callback && callback();
        });
    },
    render : function() {
        var me = this;
        ROOT.appendChild( me.left );
        ROOT.appendChild( me.right );
    }
});
//需要抢的食物
var Bonus = function( options ) {
    //TODO type, socket, 
    this.opt = options;
    this.dom = easyDom('bonus', ['chickren']);
    this.isGrabed = false;
    this._init();
};
$.extend( Bonus.prototype, {
    _init : function(){
        
    },
    render : function() {
        
    }    
});
