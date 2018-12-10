const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = {};
app.use(express.static(path.join(__dirname, 'public')))

app.get('/video', function(req, res){
  res.sendFile(__dirname + '/video.html');
});

app.get('/api/video', function(req, res) {
  const data = {
    video_list: [{
      pid: 1,
      front: "http://img3.imgtn.bdimg.com/it/u=3755615157,2369017090&fm=11&gp=0.jpg",
      url: "http://pj6zp7ks4.bkt.clouddn.com/video/xytywm_test.mp4",
      name: "西雅图夜未眠"
    }, {
      pid: 2,
      front: "http://img4.imgtn.bdimg.com/it/u=2124477208,2275244596&fm=11&gp=0.jpg",
      url: "http://pj6zp7ks4.bkt.clouddn.com/video/prxd.mp4",
      name: "怦然心动"
    }]
  }
  res.json(data);
});

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
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    