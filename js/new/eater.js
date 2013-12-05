/*
 * 
 * @file     : eater.js
 * @desc     : 
 * @author   : chenluyang@baidu.com
 * @data     : 2012-06-16
 * @requires : 
 */
var ROOT = document.getElementById('eater'),
    WIDTH = window.document.clientWidth,
    HEIGHT = window.document.clientHeight,
    IMGS = {
        'PC'        : [
            'css/pc/bg.png',
            'css/pc/avatar-bg.png',
            'css/pc/roombg.png',
            'css/pc/main.png',
            'css/pc/desk.png',
            'css/pc/EMOTION_1.png',
            'css/pc/EMOTION_2.png',
            'css/pc/R.png',
            'css/pc/H.png',
            'css/pc/left.png',
            'css/pc/right.png',
            'css/pc/blood_bed.png',
            'css/pc/yellow_blood.png',
            'css/pc/green_blood.png',
            'css/pc/g.png'
        ],
        'MOBILE'    : [
            '',
        ]
    },
    PAGES = [    /*------------------------------开始页--------------------------------------------*/ 
                 { 
                    id : 'cover', className : 'cover', comps : [{
                        id : 'baozi', className : ['baozi'], active : true,
                        events : {}
                    },{
                        id : 'handbook', className : ['handbook'], active : true,
                        events : {}
                    },{
                        id : 'ad', className : ['ad'], active : true,
                        events : {}
                    },{
                        id : 'setting', className : ['setting'], active : true,
                        events : {}
                    },{
                        id : 'start', className : ['start'], active : true,
                        events : {'touchstart click' : function(){
                            this.jumpPage('choose');
                        }}
                    }]
                }, 
                /*------------------------------选择页--------------------------------------------*/ 
                { 
                    id : 'choose', className : 'main', comps : [{
                        id : 'shop', className : ['shop'], active : true,
                        events : {}
                    },{
                        id : 'back', className : ['back'], active : true,
                        events : {'touchstart click' : function(){
                            this.jumpPage('cover');
                        }}
                    },{
                        id : 'competition', className : ['competition'], active : true,
                        events : {'touchstart click' : function(){
                            this.jumpPage('login');
                        }}
                    },{
                        id : 'mission', className : ['mission'], active : true,
                        events : {}
                    }]
                },
                /*------------------------------登陆页--------------------------------------------*/ 
               { 
                    id : 'login', className : 'login', comps : [{
                        id : 'side-left', className :['side-left'], active : true,
                        events : {'touchstart click' : function() {
                            var me = this, head = me.getPage(me.setting.curr).components['head'];
                            head.change(-1);
                        }}
                    },{
                        id : 'side-right', className : ['side-right'], active : true,
                        events : {'touchstart click' : function() {
                            var me = this, head = me.getPage(me.setting.curr).components['head'];
                            head.change(1);
                        }}
                    },{
                        id : 'name', className : ['name'], active : true,
                        events : {}
                    },{
                        id : 'head', className : ['head-1'], active : true,
                        attrs : {'classNames' : ['head-1', 'head-2'], 
                                  'change' : function(dir){
                                                var me = this, dom = me.dom, nowName = dom.className;
                                                dir = Math.round(dir);
                                                dir > 1 && ( dir = 1);
                                                dir < -1 && ( dir = -1);
                                                for( var i = 0, len = me.classNames.length; i < len; i++ ) {
                                                    if(nowName == me.classNames[i]) {
                                                        var temp = i + dir >= len ? 0 : i + dir;
                                                        temp < 0 && ( temp = len - 1);
                                                        dom.className = me.classNames[temp];
                                                    }
                                                }
                                            }
                        }
                    },{
                        id : 'confirm', className : ['confirm'], active : true,
                        events : {'touchstart click' : function() {
                            var me = this, socket = me.socket, username = me.getPage(me.setting.curr).components['textfield'].dom;
                            if(username.value != '' && username.value != '请输入姓名') {
                                socket.send('{"dataType":"addPlayer","playerName":"' + username.value + '"}');
                            }else{
                                username.value = '';
                                username.focus();
                            }
                        }}
                    },{
                        id : 'back', className : ['back'], active : true,
                        events : {'touchstart click' : function(){
                            this.jumpPage('choose');
                        }}
                    },{
                        id : 'textfield', template : '<textarea id="textfield" class="textfield">请输入姓名</textarea>', active : true,
                        events : {'focus' : function(){
                            var me = this, dom = me.pages[me.setting.curr].components['textfield'].dom;
                            dom.value = '';
                            dom.style.color = 'black';
                        }}
                    }]
                },
                /*------------------------------房间列表页--------------------------------------------*/ 
                { 
                    id : 'rooms', className : 'rooms', comps : [{
                        id : 'back', className : ['back'], active : true,
                        events : { 'touchstart click ' : function() {
                                this.socket.send('{"dataType" : "leaveRoom"}');
                                this.jumpPage('login');
                        }}}
                ]},
                /*------------------------------游戏准备页--------------------------------------------*/ 
                { 
                    id : 'prepare', className : 'prepare', comps : [{
                        id : 'back', className : ['back'], active : true,
                        events : {'touchstart click' : function() {
                            this.socket.send('{"dataType":"leaveRoom"}');
                        }}
                    },{
                        id : 'startGame', className : ['startGame'], active : true,
                        events : {'touchstart click' : function() {
                            this.jumpPage('play');
                            this.play.start();
                        }}
                    }]
                },
                /*------------------------------游戏页--------------------------------------------*/ 
                {
                    id  : 'play', className : 'main', comps : [{
                        id : 'desk', className : ['desk']
                    }
                    ]
                }
        ];
var SOCKET_METHODS = {'addPlayer' : function(msg) {
                            var game = this;
                            //console.log(msg)
                            if( msg.flag == 'Y') {
                                game.socket.send('{"dataType":"getAllRooms"}');
                            }
                        },
                      'allRooms' : function(msg) {
                          var game = this;
                          game.addRooms(msg.roomInfo);
                          page = game.jumpPage('rooms');
                          game.roomList.render(ROOT);
                      },
                      'joinRoom' : function( msg ) {
                          if( msg.flag == 'Y') {
                              //console.log('success');
                          }
                      },
                      'playerInfo' : function(msg) {
                          //alert('playerinfo');
                          if(msg.flag == 'Y') {
                              var game = this;
                              if( game.isMyself( msg.roomInfo.players ) ) {
                                  game.enterRoom(msg.roomInfo, function(){
                                      game.play = new Play( game.id, msg );
                                      game.play.area.event(function(){
                                          //game.socket.send('{"dataType" : "updateRoom", }')
                                          game.socket.send('{"dataType":"updateRoom","roomId":"' + game.play.roomId + '","foodId":1}');
                                      });
                                      //game.play.start();
                                  })
                              }
                          }
                      },
                      'updateRoom' : function( msg ) {
                          var game = this;
                          game.play.update( msg )
                          game.play.isEnd && game.jumpPage('result');
                          
                      },
                      'leaveRoom' : function(msg) {
                          //console.log(msg);
                          this.jumpPage('login')
                      }
                     };
var eater = new Game({ imgsSrc : IMGS.PC });
//add all the pages
eater.addPages(PAGES)
eater.addSocketMethods(SOCKET_METHODS)
