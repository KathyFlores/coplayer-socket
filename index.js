const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = {};

io.on('connection', function(socket){
  console.log('user connected:' + socket.id);
  socket.on('online', function (data) {
    console.log(data.id + ' is now online!');
    users[data.id] = data.id;
  });
  socket.on('disconnect', function(){
    console.log('user disconnected:' + socket.id);
    delete users[socket.id];
  });
  socket.on('sync', function(data) {
    if (users[data.remote]) {
      io.sockets.sockets[data.remote].emit('sync', data);
      io.sockets.sockets[data.local].emit('sync', data);
    } else {
      io.sockets.sockets[data.local].emit('sync', {errorMsg: 'user not found!'});
    }
  });
  socket.on('play', function(data) {
    if (users[data.remote]) {
      io.sockets.sockets[data.remote].emit('play', data);
      io.sockets.sockets[data.local].emit('play', data);
    } else {
      io.sockets.sockets[data.local].emit('play', {errorMsg: 'user not found!'});
    }
  });
  socket.on('error messgae', function(data) {
    console.log('error message:' + data.local);
    if (users[data.local]) {
      io.sockets.sockets[data.local].emit('error message', data);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    
