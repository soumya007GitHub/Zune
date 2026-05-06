import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, CameraOff, Camera, MicOff, Mic, ScreenShareOff, ScreenShare, MessagesSquare, PhoneOff, Maximize2, Minimize2 } from "lucide-react";
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import server from '../environment';

const server_url = server;

var connections = {};

const LocalVideoTile = React.memo(function LocalVideoTile({ localVideoref }) {
    return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden border border-white/10 group">
            <video
                ref={localVideoref}
                autoPlay
                muted
                className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
                You
            </span>
        </div>
    );
});

const RemoteVideoTile = React.memo(function RemoteVideoTile({ video, onZoom }) {
    return (
        <div
            className="relative w-full h-full bg-black rounded-xl overflow-hidden border border-white/10 group"
        >
            <video
                data-socket={video.socketId}
                ref={(ref) => {
                    if (ref && video.stream) {
                        ref.srcObject = video.stream;
                    }
                }}
                autoPlay
                className="w-full h-full object-cover"
            />
            <button
                onClick={() => onZoom(video.socketId)}
                className="absolute top-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded opacity-0 group-hover:opacity-100 transition"
            >
                <Maximize2 size={18} />
            </button>
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.video.socketId === nextProps.video.socketId && prevProps.video.stream === nextProps.video.stream && prevProps.onZoom === nextProps.onZoom;
});

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeet() {
    const navigate = useNavigate();

    // =========================
    // AUTHENTICATION
    // =========================
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // =========================
    // SOCKET REFERENCES
    // =========================
    var socketRef = useRef();        // Stores socket connection instance (no re-render)
    let socketIdRef = useRef();      // Stores current user unique socket ID


    // =========================
    // VIDEO REFERENCES
    // =========================
    let localVideoref = useRef();    // Reference to own video DOM element
    const videoRef = useRef([]);     // Stores list of remote video objects (no re-render)


    // =========================
    // DEVICE AVAILABILITY
    // =========================
    let [audioAvailable, setAudioAvailable] = useState(false);   // Is microphone available?
    let [videoAvailable, setVideoAvailable] = useState(false);   // Is camera available?
    let [screenAvailable, setScreenAvailable] = useState(false);     // Is screen sharing supported?


    // =========================
    // MEDIA STATES (ON/OFF)
    // =========================
    let [audio, setAudio] = useState();     // Is mic ON/OFF
    let [video, setVideo] = useState();   // Is camera ON/OFF
    let [screen, setScreen] = useState();   // Is screen sharing active


    // =========================
    // USER INFO
    // =========================
    let [username, setUsername] = useState("");         // User's name
    let [roomId, setRoomId] = useState("");             // Room ID for the meeting
    let [askForUsername, setAskForUsername] = useState(true); // Show lobby or not


    // =========================
    // ZOOM VIDEO
    // =========================
    let [zoomedVideoId, setZoomedVideoId] = useState(null);  // Socket ID of zoomed video


    // =========================
    // CHAT SYSTEM
    // =========================
    let [messages, setMessages] = useState([]);   // All chat messages
    let [message, setMessage] = useState("");     // Current typed message
    let [newMessages, setNewMessages] = useState(0); // Unread message count


    // =========================
    // UI CONTROL
    // =========================
    let [showModal, setModal] = useState(false);   // Show/hide chat panel


    // =========================
    // REMOTE VIDEO STREAMS
    // =========================
    let [videos, setVideos] = useState([]);   // List of remote users' video streams

    const handleZoomVideo = useCallback((id) => {
        setZoomedVideoId(id);
    }, []);

    // Authentication check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
        } else {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, [navigate]);

    useEffect(() => {
        // when first time component loads ask for video and audio permissions and show them in the UI
        if (isAuthenticated) {
            getPermissions();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio]);

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])


    // handles permissions for video, audio, screen share
    const getPermissions = async () => {
        try {
            // Video permission
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            // audio permission
            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            // if browser supports screen share then enable in our component
            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            // if video or audio anything has given the permission then dispaly it in the UI
            if (videoPermission || audioPermission) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({
                    video: videoPermission,
                    audio: audioPermission
                });

                if (userMediaStream) {
                    window.localStream = userMediaStream;

                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // get audio, video of user and display it
    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    // get audio, video of user and display it as well as emit to others
    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    // share screen functionality
    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    // when screen shared show it in own screen as well as emit to others
    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            setVideo(videoAvailable);
            setAudio(audioAvailable);

        })
    }

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();

    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', roomId)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
    }

    let handleAudio = () => {
        setAudio(!audio);
    }

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/videoMeet"
    }

    const calculateGridCols = () => {
        const totalVideos = videos.length + 1; // +1 for local video

        if (totalVideos === 1) return "grid-cols-1";
        if (totalVideos === 2) return "grid-cols-2";
        if (totalVideos === 3) return "grid-cols-3";
        if (totalVideos === 4) return "grid-cols-2";
        return "grid-cols-3";
    };

    const calculateRowSize = () => {
        const totalVideos = videos.length + 1;

        if (totalVideos === 1) return "auto-rows-[calc(100vh-200px)]";
        if (totalVideos === 2) return "auto-rows-[calc(50vh-120px)]";
        if (totalVideos === 3) return "auto-rows-[calc(50vh-120px)]";
        if (totalVideos === 4) return "auto-rows-[calc(50vh-120px)]";
        return "auto-rows-[300px]";
    };

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }

    let closeChat = () => {
        setModal(false);
    }

    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    let sendMessage = () => {
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    let connect = async () => {
        if (!username.trim()) {
            alert("Please enter your name");
            return;
        }

        if (!roomId.trim()) {
            alert("Please enter a room ID to join the meeting.");
            return;
        }

        setAskForUsername(false);
        await getMedia();
    };

    if (!isAuthenticated || isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#08123b] flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#08123b] text-white flex flex-col">

            {askForUsername ? (
                // ================= LOBBY =================
                <div className="flex items-center justify-center min-h-screen px-4">

                    <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">

                        <h2 className="text-2xl font-semibold text-center mb-6">
                            Join Zune Meeting
                        </h2>

                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/20 focus:outline-none focus:border-[#8582dd]"
                        />

                        <input
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter room ID"
                            className="w-full px-4 py-3 mt-3 rounded-lg bg-transparent border border-white/20 focus:outline-none focus:border-[#8582dd]"
                            required
                        />

                        <button
                            onClick={connect}
                            className="mt-4 w-full bg-blue-600 border border-blue-600 py-3 rounded-lg transition hover:bg-white hover:text-blue-600"
                        >
                            Connect
                        </button>

                        <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
                            <video
                                ref={localVideoref}
                                autoPlay
                                muted
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // ================= MEETING =================
                <div className="flex flex-col flex-1 relative overflow-hidden">

                    {/* ================= ROOM ID HEADER ================= */}
                    <div className="bg-[#0c143d] border-b border-white/10 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">Room ID:</span>
                            <span className="font-mono text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded">
                                {roomId}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(roomId);
                                alert("Room ID copied to clipboard!");
                            }}
                            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                            Copy
                        </button>
                    </div>

                    {/* ================= CHAT PANEL (RESPONSIVE) ================= */}
                    {showModal && (
                        <div className="
            fixed md:absolute
            bottom-0 md:top-0 md:right-0
            w-full md:w-[320px]
            h-[60vh] md:h-full
            bg-[#0c143d]
            border-t md:border-l border-white/10
            z-50 flex flex-col
            rounded-t-2xl md:rounded-none
          ">

                            <div className="p-4 border-b border-white/10 font-semibold flex items-center justify-between transition-all duration-200">

                                <span>Chat</span>

                                <button
                                    onClick={() => setModal(false)}
                                    className="p-1 rounded hover:bg-white/10 transition"
                                >
                                    <X size={18} />
                                </button>

                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.length ? (
                                    messages.map((item, index) => (
                                        <div key={index}>
                                            <p className="text-xs text-gray-400">{item.sender}</p>
                                            <p className="text-sm">{item.data}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        No messages yet
                                    </p>
                                )}
                            </div>

                            <div className="p-3 border-t border-white/10 flex gap-2">
                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message"
                                    className="flex-1 px-3 py-2 rounded-md bg-transparent border border-white/20 focus:outline-none focus:border-[#8582dd]"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-700 transition whitespace-nowrap"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ================= ZOOMED VIDEO MODAL ================= */}
                    {zoomedVideoId && (
                        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                            <div className="relative w-full h-full max-w-5xl max-h-screen bg-black rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setZoomedVideoId(null)}
                                    className="absolute top-4 right-4 z-60 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
                                >
                                    <Minimize2 size={24} />
                                </button>
                                {zoomedVideoId === 'local' ? (
                                    <video
                                        ref={localVideoref}
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    videos.map((video) => (
                                        video.socketId === zoomedVideoId && (
                                            <video
                                                key={video.socketId}
                                                ref={(ref) => {
                                                    if (ref && video.stream) {
                                                        ref.srcObject = video.stream;
                                                    }
                                                }}
                                                autoPlay
                                                className="w-full h-full object-cover"
                                            />
                                        )
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ================= VIDEO GRID ================= */}
                    <div className={`flex-1 grid ${calculateGridCols()} ${calculateRowSize()} gap-2 md:gap-3 p-2 md:p-3 overflow-auto`}>
                        <LocalVideoTile localVideoref={localVideoref} onZoom={handleZoomVideo} />
                        {videos.map((video) => (
                            <RemoteVideoTile key={video.socketId} video={video} onZoom={handleZoomVideo} />
                        ))}
                    </div>

                    {/* ================= CONTROLS ================= */}
                    <div className="
          h-16
          bg-[#0c143d]
          border-t border-white/10
          flex
          items-center justify-center gap-2 md:gap-3
          px-2 py-2
          overflow-x-auto
        ">

                        <button
                            onClick={handleVideo}
                            className="h-10 px-3 md:px-4 flex items-center justify-center text-xs md:text-sm rounded-md bg-blue-600 border border-blue-600 whitespace-nowrap hover:bg-white hover:text-blue-600 transition"
                        >
                            {video ? <CameraOff size={20} /> : <Camera size={20} />}
                        </button>

                        <button
                            onClick={handleAudio}
                            className="h-10 px-3 md:px-4 flex items-center justify-center text-xs md:text-sm rounded-md bg-blue-600 border border-blue-600 whitespace-nowrap hover:bg-white hover:text-blue-600 transition"
                        >
                            {audio ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        {screenAvailable && (
                            <button
                                onClick={handleScreen}
                                className="h-10 px-3 md:px-4 flex items-center justify-center text-xs md:text-sm rounded-md bg-blue-600 border border-blue-600 whitespace-nowrap hover:bg-white hover:text-blue-600 transition"
                            >
                                {screen ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
                            </button>
                        )}

                        <button
                            onClick={() => setModal(!showModal)}
                            className="h-10 px-3 md:px-4 flex items-center justify-center gap-1 text-xs md:text-sm rounded-md bg-blue-600 border border-blue-600 whitespace-nowrap hover:bg-white hover:text-blue-600 transition"
                        >
                            <MessagesSquare size={20} /> {newMessages > 0 && `(${newMessages})`}
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="h-10 px-4 md:px-5 flex items-center justify-center text-xs md:text-sm rounded-md bg-red-600 hover:bg-red-700 whitespace-nowrap transition"
                        >
                            <PhoneOff size={20} />
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}