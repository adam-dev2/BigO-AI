import app from './app.js';
import { createServer } from 'http';
import { initSocket } from './socket/index.js';
import { PORT } from './config/env.js';

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => console.log('server running on port 3000'));4