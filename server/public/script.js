const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const myPeer = new Peer(undefined, {
    host: "/",
    port: "3001"
})
const myVideo = document.createElement("video");
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on("call", call => {
        call.answer(stream)
        console.log("a call detected")
    })

    // new user detected
    socket.on("user-connected", newUserId => {
        connectToNewUser(newUserId, stream);
        console.log("finish connecting to new user");
    })
})

myPeer.on("open", id => {
    socket.emit("join-room", ROOM_ID, id);
})

function connectToNewUser(newUserId, stream) {
    const call = myPeer.call(newUserId, stream);
    console.log("called " + newUserId);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
        console.log("streaming")
        addVideoStream(video, userVideoStream);
    })
    call.on("close", () => {
        video.remove()
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    videoGrid.append(video)
}