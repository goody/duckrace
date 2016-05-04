var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected | ' + socket.id);
    socket.on('disconnect', function(){
       console.log('user disconnected | ' + socket.id); 
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log(socket.id + ' said :' + msg);
    });
    socket.on('get odds', function(horses){
        var total = 0;
        horses.forEach(function(horse){
           total += horse.bets; 
        });
        horses.forEach(function(horse) {
            horse.odds = _getOdds(total, horse.bets);
        });
        console.dir(horses);
       io.emit('get odds', horses); 
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function _getOdds(totalPool, totalHorse){
    console.log('total: ' + totalPool, 'total horse: ' + totalHorse);
  var diff = totalPool - totalHorse;
  var odds = diff/totalHorse;
  return (odds < 1 ? odds : Math.round(odds)) + ' to 1';
};