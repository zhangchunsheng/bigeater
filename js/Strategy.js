(function(window, $){
    E.Strategy = {
        pages : [{ id : 'cover', className : 'cover', btns : [{
                id : 'baozi',
                className : 'baozi',
                active : true,
                onclick : function(){}
            },{
                id : 'handbook',
                className : 'handbook',
                active : true,
                onclick : function(){}
            },{
                id : 'ad',
                className : 'ad',
                active : true,
                onclick : function(){
                    var d
                }
            },{
                id : 'setting',
                className : 'setting',
                active : true,
                onclick : function(){}
            },{
                id : 'start',
                className : 'start',
                active : true,
                onclick : function(){
                    game._jumpPage('choose');
                }
            }],
            init : function() {
                var ad = document.createElement('div');
                ad.className = 'a'
            }
        },{ id : 'choose', className : 'main', btns : [{
                id : 'shop',
                className : 'shop',
                active : true,
                onclick : function(){}
            },{
                id : 'back',
                className : 'back',
                active : true,
                onclick : function(){
                    game._jumpPage('cover');
                }
            },{
                id : 'langame',
                className : 'langame',
                active : true,
                onclick : function(){
                    game._jumpPage('avatar-bg');
                }
            },{
                id : 'mission',
                className : 'mission',
                active : true,
                onclick : function(){}
            }]
        },{ id : 'avatar-bg', className : 'avatar-bg', btns : [{
                id : 'side-left',
                className : 'side-left',
                active : true,
                onclick : function(){
                    var head = document.getElementById('head');
                    head.className = head.className == 'head-1'? 'head-2' : 'head-1';
                }
            },{
                id : 'side-right',
                className : 'side-right',
                active : true,
                onclick : function(){
                    var head = document.getElementById('head');
                    head.className = head.className == 'head-1'? 'head-2' : 'head-1';
                }
            },{
                id : 'name',
                className : 'name',
                active : true,
                onclick : function(){}
            },{
                id : 'head',
                className : 'head-1',
                active : true,
                onclick : function(){}
            },{
                id : 'confirm',
                className : 'confirm',
                active : true,
                onclick : function(){
                    var username = document.getElementById('textfield');
                    if(username.value != '') {
                        game.socket.send('{"dataType":"addPlayer","playerName":"' + username.value + '"}');
                        //game._jumpPage('room-bg');
                    }else{
                        username.focus();
                    }
                    
                }
            },{
                id : 'back',
                className : 'back',
                active : true,
                onclick : function(){
                    game._jumpPage('choose');
                }
            }],
            init : function() {
                var text = document.createElement('textarea');
                text.id = 'textfield';
                text.className = 'textfield';
                text.value ='请输入姓名';
                $(text).bind('focus', function(){ this.value = ''; this.style.color = 'black';})
                E._root.appendChild(text);
            }
        },{ id : 'room-bg', className : 'room-bg', btns : [{
                id : 'back',
                className : 'back',
                active : true,
                onclick : function(){
                    game._jumpPage('avatar-bg');
                }
            }], 
            init : function() {
                var rooms = game.rooms;
                for( var i = 0, len = rooms.length; i < len; i++) {
                    var room = new E.Room(rooms[i], 'roomNo' + i);
                    E._root.appendChild(room);
                }
            }
        },{ id : 'prepare', className : 'prepare', btns : [{
                id : 'back',
                className : 'back',
                active : true,
                onclick : function(){
                    game.socket.send('{"dataType":"leaveRoom"}');
                    game._jumpPage('room-bg');
                }
            },{
                id : 'startGame',
                className : 'startGame',
                active : true,
                onclick : function(){
                    game._jumpPage('play');
                }
            }],
            init : function() {
                game.room && game.room.init();
            } 
        },{ id : 'play', className : 'main', btns : [{
                id : 'desk',
                className : 'desk',
                active : true,
                onclick : function(){}
            },{
                id : 'leftAvatar',
                className : 'avatar1',
                active : true,
                onclick : function(){}
            },{
                id : 'rightAvatar',
                className : 'avatar2',
                active : true,
                onclick : function(){}
            }],
            init : function(){
                E.Bar.init();
                game.myself  = new E.Player('leftPlayer');
                game.competitor = new E.Player('rightPlayer');
                var lprint = new E.Print('leftPrint', game.myself);
                var rprint = new E.Print('rightPrint', game.myself);
            }
        }
        ]
    };
})(window, $);