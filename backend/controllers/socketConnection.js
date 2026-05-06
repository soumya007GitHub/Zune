import { Server } from "socket.io";

// stores all rooms and their users
let rooms = {};
// stores chat messages per room
let messages = {};
// maps each socket to its room
let socketToRoom = {};
// tracks when a user joined
let timeOnline = {};

export const socketConnection = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("CONNECTED:", socket.id);

        // ================= JOIN CALL =================
        socket.on("join-call", (roomId) => {
            // roomId is now the specific ID entered by the user
            if (!rooms[roomId]) {
                rooms[roomId] = new Set();
            }

            rooms[roomId].add(socket.id);
            socketToRoom[socket.id] = roomId;
            timeOnline[socket.id] = new Date();

            rooms[roomId].forEach(id => {
                io.to(id).emit("user-joined", socket.id, Array.from(rooms[roomId]));
            });

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
            io.to(toId).emit("signal", socket.id, message);
        });

        // ================= CHAT MESSAGE =================
        socket.on("chat-message", (data, sender) => {
            const roomId = socketToRoom[socket.id];
            if (!roomId) return;

            if (!messages[roomId]) {
                messages[roomId] = [];
            }

            const msg = {
                sender,
                data,
                socketId: socket.id
            };

            messages[roomId].push(msg);
            rooms[roomId].forEach(id => {
                io.to(id).emit("chat-message", data, sender, socket.id);
            });
        });

        // ================= DISCONNECT =================
        socket.on("disconnect", () => {
            const roomId = socketToRoom[socket.id];
            if (!roomId) return;

            const timeSpent = Date.now() - timeOnline[socket.id];
            console.log(`User ${socket.id} stayed ${timeSpent} ms`);

            rooms[roomId].forEach(id => {
                io.to(id).emit("user-left", socket.id);
            });

            rooms[roomId].delete(socket.id);
            delete socketToRoom[socket.id];
            delete timeOnline[socket.id];

            if (rooms[roomId].size === 0) {
                delete rooms[roomId];
                delete messages[roomId];
            }
        });
    });

    return io;
};