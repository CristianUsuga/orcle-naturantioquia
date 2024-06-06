// src/app.js
import 'dotenv/config';
import { Server } from './models/server.js';

const server = new Server();
server.listen();
console.log('ruta', server.__dirname);
