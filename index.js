var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require('cors');
var port = process.env.PORT || 3000;


app.use(cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let connectedUsers = [];
io.on('connection', function(socket){
  // for video
  // It's necessary to socket knows all clients connected
  connectedUsers.push(socket.id);

  // Emit to myself the other users connected array to start a connection with each them
  const otherUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  console.log('mahesh 2423423'+otherUsers)
  socket.emit('other-users', otherUsers);

  // Send Offer To Start Connection
  socket.on('offer', (socketId, description) => {
    socket.to(socketId).emit('offer', socket.id, description);
  });

  // Send Answer From Offer Request
  socket.on('answer', (socketId, description) => {
    socket.to(socketId).emit('answer', description);
  });

  // Send Signals to Establish the Communication Channel
  socket.on('candidate', (socketId, candidate) => {
    socket.to(socketId).emit('candidate', candidate);
  });

  // Remove client when socket is disconnected
  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  });
  //-----------end video ------------------//


  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
