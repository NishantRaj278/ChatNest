import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server( server, {
    cors : {
        origin: [process.env.CLIENT_API],
    }
})

const userSocketMap = {};
export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { io, server, app };