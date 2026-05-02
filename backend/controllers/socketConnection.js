import { Server } from "socket.io";

const socketConnection = (server)=>{
    const io = new Server(server);
    return io;
}

export default socketConnection;