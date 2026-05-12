import {Server as SocketIOServer} from 'socket.io';
import {Server as HTTPServer} from 'http';
import { logger } from '../lib/logger.js';

export const initSocket = (httpServer:HTTPServer) => {
    const io = new SocketIOServer(httpServer,{
        cors:{
            origin:'http://localhost:5173',
            methods:['GET','POST']
        }
    });

    io.on('connection',(socket) => {
        logger.info(`Socket Connected: ${socket.id}`);

        socket.on('message',(data) => {
            logger.info(data)
        });

        socket.on('disconnect',() => {
            logger.info(`Socket Disconnected: ${socket.id}`)
        })
    });

    return io;
}