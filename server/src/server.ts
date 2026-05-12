import app from './app.js';
import { createServer } from 'http';
import { initSocket } from './socket/index.js';
import { PORT } from './config/env.js';

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => console.log(`Server is Running on port: ${PORT}`));