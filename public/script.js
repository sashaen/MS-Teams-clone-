const videoGrid = document.getElementById('video-grid');
const myVideo= document.createElement('video');
const socket=io.connect('/');
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
});
peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id);
})
socket.emit('join-room', ROOM_ID);

socket.on('user-connected', (userId)=>{
    connectToNewUser(userId);
});

const connectToNewUser = (userId)=>{
    console.log(userId);
}

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoGrid.append(video); 
}; 