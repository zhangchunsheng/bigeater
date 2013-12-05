2012-05-26
吃货大比拼
nodejs 8080
mongodb 27017
房间ID、用户ID、关卡
获得房间信息
getRoom
collection:roomInfo
{"roomInfo":[{"id":"room1","name":"room1","players":[],"foodInfo":[{"foodType":1,"foodNum":10}]},{"id":"room2","name":"room2","players":[],"foodInfo":[{"foodType":1,"foodNum":10}]}]}
{"id":"room1","name":"room1","players":[{"playerId":"","playerName":""}],"foodInfo":[{"foodType":1,"foodNum":10}]}
{"id":"room2","name":"room2","players":[],"foodInfo":[]}
所有房间信息：{"dataType":"allRooms","roomInfo":[{"id":"room1","name":"room1"},{"id":"room2","name":"room2"}]}
单个房间信息：{"dataType":"roomInfo","roomInfo":{"id":"room1","name":"room1","players":[]}}
collection:roomInfo
{"roomId":"room1","players"}
collection:players
{"id":"","name":"","picNum":"","roomId":""}
collection:foodInfo
{"foodId":"","foodName":""}
1 - 包子
2012-05-27
1、获取所有房间
connection.send('{"dataType":"getAllRooms"}');
{"roomInfo":[{"id":"room1","name":"room1","players":[],"foodInfo":[{"foodType":1,"foodNum":10}]},{"id":"room2","name":"room2","players":[],"foodInfo":[{"foodType":1,"foodNum":10}]}]}
foodType 1 - 包子
2、获取单个房间
connection.send('{"dataType":"getRoomInfo"}');
{"dataType":"roomInfo","flag":"Y","roomInfo":{"id":"room1","name":"room1","players":[{"playerId":"","playerName":"","foodInfo":[]}],"foodInfo":[]}}
3、加入房间
connection.send('{"dataType":"joinRoom","roomId":"room1"}');
{"dataType":"playerInfo","flag":"Y","roomInfo":{"id":"room1","name":"room1","players":[],"foodInfo":[]}}
{"dataType":"joinRoom","flag":"Y"}
4、更新房间食物
connection.send('{"dataType":"updateRoom","roomId":"room1","foodId":1}');
{"dataType":"foodInfo","flag":"Y","roomInfo":{"id":"room1","name":"room1","players":[],"foodInfo":[]}}
5、新增用户
connection.send('{"dataType":"addPlayer","playerName":"test"}');
{"dataType":"addPlayer","flag":"Y"}
6、离开房间
connection.send('{"dataType":"leaveRoom"}');
{"dataType":"roomInfo","flag":"Y","roomInfo":{"id":"room1","name":"room1","players":[{"playerId":"","playerName":"","foodInfo":[]}],"foodInfo":[]}}
2012-12-15
查看服务端代码