
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io= require('socket.io')(server)
const { v4:uuidv4 } = require('uuid');
const { ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
// directs us in room with particular ID
app.get('/', (req, res)=>{
    res.redirect(`/${uuidv4()}`);
    
})
// way to room
app.get('/:room', (req, res)=>{
    res.render('room', { roomId: req.params.room})
})

// confirmation after joining room 
io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`The Server is Running on PORT : ${PORT}`));