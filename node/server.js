var sys = require("util"),
	ws = require("./lib/ws/server"),
	db = require("./config.js").db;
	
var server = ws.createServer({debug:true});

var Trigger = {
    _instance : {},     //roomId
    add : function( id ){},
    remove : function(){},
    trig : function(){
        
    }
};
function init() {
	db.collection("roomInfo").remove();
	for(var i = 0 ; i < 4 ; i++) {
		num = i + 1;
		console.log("insert");
		db.collection("roomInfo").insert({
			id: "room" + num,
			name: "room" + num,
			foodInfo: [{
				foodType: 1,
				foodNum: 10
			},{
                foodType: 2,
                foodNum: 3
            },{
                foodType: 3,
                foodNum: 1
            }],
			players: []
		}, function(err, result) {
			console.log(result);
		});
	}
	db.collection("roomInfo").find().toArray(function(err, items) {
		console.dir(items);
	});
}

init();

// Handle WebSocket Requests
server.addListener("connection", function(conn) {
	conn.send("Connection: " + conn.id);
	
	conn.addListener("message", function(message) {
		//conn.broadcast("<" + conn.id + ">" + message);
		//console.log("<" + conn.id + ">" + message);
		server.send("test");
		if(message.indexOf("dataType") < 0) {
			return;
		}
		message = eval('(' + message + ')');
		if(message.dataType == "getData") {
			var json = '{"status":"ok"}';
			server.broadcast(json);
		} else if(message.dataType == "getAllRooms") {//获取所有房间的信息
			var json = '';
			db.collection("roomInfo").find().toArray(function(err, items) {
				json = items;
				server.send(conn.id, '{"dataType":"allRooms","roomInfo":' + JSON.stringify(json) + '}');
			});
		} else if(message.dataType == "getRoomInfo") {//获取单个房间的信息
			db.collection("roomInfo").find({id:"" + message.roomId + ""}).toArray(function(err, items) {
				if(items.length == 1) {
					server.send(conn.id, '{"dataType":"roomInfo","flag":"Y","roomInfo":' + JSON.stringify(items[0]) + '}');
				} else {
					server.send(conn.id, '{"dataType":"roomInfo","flag":"N"}');
				}
			});
		} else if(message.dataType == "joinRoom") {//加入房间
			var roomId = message.roomId;
			var playerName = "";
			db.collection("players").find({id:"" + conn.id + ""}).toArray(function(err, items) {
				if(items.length == 1) {
					playerName = items[0].name;
				}
				console.log("playerName:" + playerName);
				db.collection("roomInfo").find({id:"" + roomId + ""}).toArray(function(err, items) {
					if(items.length == 1) {
						if(items[0].players.length == 2) {//开始游戏
							//server.send(items[0].players[0].id, '{"dataType":"startGame","roomInfo":' + JSON.stringify(items[0]) + '}');
							//server.send(items[0].players[1].id, '{"dataType":"startGame","roomInfo":' + JSON.stringify(items[0]) + '}');
							server.broadcast('{"dataType":"playerInfo","flag":"Y","roomInfo":' + JSON.stringify(items[0]) + '}');
						} else {
							//更新房间信息
							db.collection("roomInfo").update({id:"" + roomId + ""}, {
								'$push': {
									"players": {
										playerId: "" + conn.id + "",
										playerName: "" + playerName + ""
									}
								}
							});
							db.collection("players").update({id:"" + conn.id + ""}, {
								'$set': {
									"roomId": roomId
								}
							});
							if(items[0].players.length == 1) {//开始游戏
								var json = {
									id: items[0].id,
									name: items[0].name,
									players: [{
										playerId: items[0].players[0].playerId,
										playerName: items[0].players[0].playerName
									},{
										playerId: conn.id,
										playerName: playerName
									}],
									foodInfo: items[0].foodInfo
								};
								//server.send(items[0].players[0].id, '{"dataType":"startGame","roomInfo":' + JSON.stringify(json) + '}');
								//server.send(conn.id, '{"dataType":"startGame","roomInfo":' + JSON.stringify(json) + '}');
								server.broadcast('{"dataType":"playerInfo","flag":"Y","roomInfo":' + JSON.stringify(json) + '}');
							} else {//加入房间成功
								server.send(conn.id, '{"dataType":"joinRoom","flag":"Y"}');
								var json = {
									id: items[0].id,
									name: items[0].name,
									players: [{
										playerId: conn.id,
										playerName: playerName
									}],
									foodInfo: items[0].foodInfo
								};
								server.broadcast('{"dataType":"playerInfo","flag":"Y","roomInfo":' + JSON.stringify(json) + '}');
							}
						}
					} else {
						server.send(conn.id, '{"dataType":"joinRoom","flag":"N"}');
					}
				});
			});
		} else if(message.dataType == "leaveRoom") {
			db.collection("players").find({id:"" + conn.id + ""}).toArray(function(err, items) {
				console.log(conn.id + " logout");
				if(items.length == 1) {
					var playerName = items[0].name;
					if(typeof items[0].roomId != "undefined" && items[0].roomId != 0) {//更新房间信息
						var roomId = items[0].roomId;
						db.collection("roomInfo").find({id:"" + roomId + ""}).toArray(function(err, items) {
							db.collection("roomInfo").update({id:"" + roomId + ""}, {
								'$pull': {
									"players": {
										playerId: "" + conn.id + "",
										playerName: "" + playerName + ""
									}
								}
							});
							var players = [];
							for(var i = 0 ; i < items[0].players.length ; i++) {
								if(items[0].players[i].playerId != conn.id) {
									players[0] = new Object();
									players[0].playerId = items[0].players[i].playerId;
									players[0].playerName = items[0].players[i].playerName;
								}
							}
							var json = {
								id: items[0].id,
								name: items[0].name,
								players: players,
								foodInfo: [{
									foodType:1,
									foodNum: 10
								}]
							};
							console.dir(json);
							server.broadcast('{"dataType":"roomInfo","flag":"Y","roomInfo":' + JSON.stringify(json) + '}');
						})
						db.collection("players").update({id:"" + conn.id + ""}, {
							'$set': {
								roomId: 0
							}
						});
					}
				}
			});
		} else if(message.dataType == "updateRoom") {//更新房间食物
			var roomId = message.roomId;
			var foodId = message.foodId;
			db.collection("roomInfo").find({id:"" + roomId + ""}).toArray(function(err, items) {
				if(items.length == 1) {
					if(items[0].players.length == 2) {//检查玩家数量
						var foodNum = 0;
						for(var i = 0 ; i < items[0].foodInfo.length ; i++) {
							if(items[0].foodInfo[i].foodType == foodId) {
								foodNum = items[0].foodInfo[i].foodNum;
								break;
							}
						}
						if(foodNum <= 0) {
							server.send(items[0].players[0].playerId, '{"dataType":"foodInfo","flag":"Y","roomInfo":' + JSON.stringify(items[0]) + '}');
							server.send(items[0].players[1].playerId, '{"dataType":"foodInfo","flag":"Y","roomInfo":' + JSON.stringify(items[0]) + '}');
						} else {
							foodNum--;
							db.collection("roomInfo").update({id:"" + roomId + ""}, {
								'$pull': {
									"foodInfo": {
										foodType: foodId
									}
								}
							});
							db.collection("roomInfo").update({id:"" + roomId + ""}, {
								'$push': {
									"foodInfo": {
										foodType: foodId,
										foodNum: foodNum
									}
								}
							});
							var foodInfo = [];
							for(var i = 0 ; i < items[0].foodInfo.length ; i++) {//更新食物信息
								foodInfo[i] = new Object();
								if(items[0].foodInfo[i].foodType == foodId) {
									foodInfo[i].foodType = foodId;
									foodInfo[i].foodNum = foodNum;
								} else {
									foodInfo[i].foodType = items[0].foodInfo[i].foodType;
									foodInfo[i].foodNum = items[0].foodInfo[i].foodNum;
								}
							}
							var players = [];
							for(var i = 0 ; i < items[0].players.length ; i++) {//更新用户食物
								if(items[0].players[i].playerId == conn.id) {
									if(typeof items[0].players[i].foodInfo != "undefined") {
										for(var j = 0 ; j < items[0].players[i].foodInfo.length ; j++) {//更新食物信息
											if(items[0].players[i].foodInfo[j].foodType == foodId) {
												items[0].players[i].foodInfo[j].foodNum = items[0].players[i].foodInfo[j].foodNum + 1;
											} else {
												items[0].players[i].foodInfo[j].foodType = foodId;
												items[0].players[i].foodInfo[j].foodNum = 1;
											}
										}
									} else {
										items[0].players[i].foodInfo = [];
										items[0].players[i].foodInfo[0] = new Object();
										items[0].players[i].foodInfo[0].foodType = foodId;
										items[0].players[i].foodInfo[0].foodNum = 1;
									}
									players[i] = items[0].players[i];
								} else {
									players[i] = items[0].players[i];
								}
							}
							/*db.collection("roomInfo").update({id:"" + roomId + ""}, {
								'$set': {
									"foodInfo": foodInfo
								}
							});*/
							db.collection("roomInfo").update({id:"" + roomId + ""}, {
								'$set': {
									"players": players
								}
							});
							var json = {
								id: items[0].id,
								name: items[0].name,
								players: players,
								foodInfo: foodInfo
							};
							server.send(items[0].players[0].playerId, '{"dataType":"foodInfo","flag":"Y","roomInfo":' + JSON.stringify(json) + '}');
							server.send(items[0].players[1].playerId, '{"dataType":"foodInfo","flag":"Y","roomInfo":' + JSON.stringify(json) + '}');
						}
					} else {
						server.broadcast('{"dataType":"roomInfo","flag":"Y","roomInfo":' + JSON.stringify(items[0]) + '}');
					}
				} else {
					server.send(conn.id, '{"dataType":"updateRoom","flag":"N"}');
				}
			});
		} else if(message.dataType == "getAllPlayers") {
			db.collection("players").find().toArray(function(err, items) {
				server.send(conn.id, JSON.stringify(items));
			});
		} else if(message.dataType == "getPlayer") {//获取当前玩家
			db.collection("players").find({id:"" + conn.id + ""}).toArray(function(err, items) {
				server.send(conn.id, JSON.stringify(items));
			});
		} else if(message.dataType == "addPlayer") {//添加玩家信息
			db.collection("players").find({id:"" + conn.id + ""}).toArray(function(err, items) {
				if(items.length == 1) {
					db.collection("players").update({id:"" + conn.id + ""}, {
						id: conn.id,
						name: message.playerName
					});
				} else {
					db.collection("players").insert({
						id: conn.id,
						name: message.playerName
					}, function(err, result) {
						console.log(result);
					});
				}
			});
			server.send(conn.id, '{"dataType":"addPlayer","flag":"Y"}');
		} else if(message.dataType == "error") {
			conn.emit("error", "test");
		}
	});
});

server.addListener("error", function() {
	console.log(Array.prototype.join.call(arguments, ", "));
});

server.addListener("disconnect", function(conn) {
	db.collection("players").find({id:"" + conn.id + ""}).toArray(function(err, items) {
		console.log(conn.id + " logout");
		if(items.length == 1) {
			var playerName = items[0].name;
			if(typeof items[0].roomId != "undefined" && items[0].roomId != 0) {//更新房间信息
				var roomId = items[0].roomId;
				db.collection("roomInfo").find({id:"" + roomId + ""}).toArray(function(err, items) {
					db.collection("roomInfo").update({id:"" + roomId + ""}, {
						'$pull': {
							"players": {
								playerId: "" + conn.id + "",
								playerName: "" + playerName + ""
							}
						}
					});
					var players = [];
					for(var i = 0 ; i < items[0].players.length ; i++) {
						if(items[0].players[i].playerId != conn.id) {
							players[0] = new Object();
							players[0].playerId = items[0].players[i].playerId;
							players[0].playerName = items[0].players[i].playerName;
						}
					}
					var json = {
						id: items[0].id,
						name: items[0].name,
						players: players,
						foodInfo: [{
							foodType:1,
							foodNum: 10
						}]
					};
					console.dir(json);
					server.broadcast('{"dataType":"roomInfo","flag":"Y","roomInfo":' + JSON.stringify(json) + '}');
				})
				db.collection("players").update({id:"" + conn.id + ""}, {
					'$set': {
						roomId: 0
					}
				});
			}
		}
	});
	server.broadcast("<" + conn.id + "> disconnected");
});

server.listen(8080);