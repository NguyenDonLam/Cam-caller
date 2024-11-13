const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const myPeer = new Peer(undefined, {
  host: "peer-server-m6ay.onrender.com",
  path: "/peerserver",
  secure: true,
});
const myVideo = document.createElement("video");
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on("call", call => {
        call.answer(stream)
        console.log("answered old user's call")

        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          console.log("streaming old user's");
          addVideoStream(video, userVideoStream);
        });
    })

    // new user detected
    socket.on("user-connected", newUserId => {
        connectToNewUser(newUserId, stream);
    })
})

myPeer.on("open", id => {
    console.log("connected to peer server, joining room")
    socket.emit("join-room", ROOM_ID, id);
})

function connectToNewUser(newUserId, stream) {
    const call = myPeer.call(newUserId, stream);
    console.log("calling new user now");
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
        console.log("streaming new user's")
        addVideoStream(video, userVideoStream);
    })
    call.on("close", () => {
        video.remove()
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    console.log("Video tracks:", stream.getVideoTracks());
    if (stream.getVideoTracks().length === 0) {
      console.log("No video tracks available in the stream.");
    }
    video.addEventListener("loadedmetadata", () => {
        video.play()
        console.log("playing video")
    })
    videoGrid.append(video)
}