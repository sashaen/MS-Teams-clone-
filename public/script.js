const socket=io.connect('/');
const videoGrid = document.getElementById('video-grid');
const myVideo= document.createElement('video');

myVideo.muted= true;

var peer = new Peer(undefined,{
    path : '/pathjs',
    host: '/',
    port: '5000'

}); 

let myVideoStream 
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call=> {
          call.answer(stream); // Answer the call with an A/V stream.
          const video =document.createElement('video');
          call.on('stream', userVideoStream=> {
            // Show stream in some video/canvas element.
            addVideoStream(video, userVideoStream);
          })
        })

    socket.on('user-connected', (userId)=>{
        connectToNewUser(userId, stream);
    });
});


peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream)=>{
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream =>{
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    
    videoGrid.append(video); 
}; 