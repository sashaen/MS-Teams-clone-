const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())

require('dotenv').config();

const { auth, requiresAuth } = require('express-openid-connect');


app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
   
  })
);

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
app.use(express.urlencoded({ extended: true }))


app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', requiresAuth(), (req,  res) => {
  res.render('homePage', { name: req.oidc.user.name, pic:req.oidc.picture})
})

app.get('/meeting', requiresAuth(), (req, res) => {
  res.redirect(uuidV4());
}) 


app.post('/join', requiresAuth(), (req, res) => {
  const uuiid2 = req.body.putID;
  res.redirect(uuiid2);
}) 

app.post('/makeID', requiresAuth(), (req, res) => {
  const uuiid = req.body.makingid;
  //console.log()
  res.redirect(uuiid);
}) 

app.get('/:room', requiresAuth(), (req, res) => {
  console.log(req.oidc.user);
  res.render('room', { roomId: req.params.room, name:req.oidc.user.name, })
})



io.on('connection', socket => {
  socket.on('join-room', (roomId, userId, username) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message, username)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3030)
