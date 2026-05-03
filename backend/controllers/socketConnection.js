import { Server } from "socket.io";

// stores all rooms and their users
// { roomId: Set(socketIds) }
let rooms = {};

// stores chat messages per room
// { roomId: [ { sender, data, socketId } ] }
let messages = {};

// maps each socket to its room
// { socketId: roomId }
let socketToRoom = {};

// tracks when a user joined
// { socketId: Date }
let timeOnline = {};

export const socketConnection = (server) => {
    const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

    io.on("connection", (socket) => {

        // runs whenever a new client connects
        // each client has a unique socket.id
        console.log("CONNECTED:", socket.id);


        // ================= JOIN CALL =================
        socket.on("join-call", (roomId) => {
            // roomId is like /room1, /room2

            // create room if it doesn't exist
            if (!rooms[roomId]) {
                rooms[roomId] = new Set();
            }

            // add current user to the room
            rooms[roomId].add(socket.id);

            // memoize the socket for fast lookup later
            socketToRoom[socket.id] = roomId;

            // store the time when user joined
            timeOnline[socket.id] = new Date();


            // notify all users in the room that a new user joined
            rooms[roomId].forEach(id => {
                io.to(id).emit("user-joined", socket.id, Array.from(rooms[roomId]));
            });


            // send old chat messages to the newly joined user
            // so he/she can see previous conversation
            if (messages[roomId]) {
                messages[roomId].forEach(msg => {
                    io.to(socket.id).emit(
                        "chat-message",
                        msg.data,
                        msg.sender,
                        msg.socketId
                    );
                });
            }
        });


        // ================= SIGNAL (WebRTC) =================
        socket.on("signal", (toId, message) => {
            // sends signaling data (offer/answer/ICE candidates)
            // used to establish peer-to-peer WebRTC connection
            io.to(toId).emit("signal", socket.id, message);
        });


        // ================= CHAT MESSAGE =================
        socket.on("chat-message", (data, sender) => {

            // directly get room of this socket (O(1) lookup)
            const roomId = socketToRoom[socket.id];

            // if user is not in any room, ignore
            if (!roomId) return;


            // create message array if not exists
            if (!messages[roomId]) {
                messages[roomId] = [];
            }

            // construct message object
            const msg = {
                sender,
                data,
                socketId: socket.id
            };

            // store message in room history
            messages[roomId].push(msg);

            console.log("message", roomId, ":", sender, data);


            // broadcast message to all users in the room
            rooms[roomId].forEach(id => {
                io.to(id).emit("chat-message", data, sender, socket.id);
            });
        });


        // ================= DISCONNECT =================
        socket.on("disconnect", () => {

            // find which room this user belongs to
            const roomId = socketToRoom[socket.id];

            // if not in any room, do nothing
            if (!roomId) return;


            // calculate how long user stayed in the room
            const timeSpent = Date.now() - timeOnline[socket.id];
            console.log(`User ${socket.id} stayed ${timeSpent} ms`);


            // notify all users in the room that this user left
            rooms[roomId].forEach(id => {
                io.to(id).emit("user-left", socket.id);
            });


            // remove user from the room
            rooms[roomId].delete(socket.id);

            // clean up mappings
            delete socketToRoom[socket.id];
            delete timeOnline[socket.id];


            // if room becomes empty, delete it completely
            if (rooms[roomId].size === 0) {
                delete rooms[roomId];
                delete messages[roomId]; // also clear chat history
            }
        });

    });

    return io;
};