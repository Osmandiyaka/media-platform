import net from 'node:net';
import { randomUUID } from 'node:crypto';

import { logger } from '../../share/logger.js';
import wrappedSocket from './tcp-connection.js';

export default class TcpServerAdaptor {
    constructor({ port = 4444, onConnection } = {}) {
        this.port = port;
        this.onConnection = onConnection;
        this.server = null;
        this.connections = new Map();
    }

    async startServer() {
        this.server = net.createServer((socket) => {
            const id = randomUUID();
            const conn = wrappedSocket(socket, id);
            this.connections.set(id, conn);
            logger.info(`TcpServerAdapter: new connection ${id} from ${socket.remoteAddress}`);
            this.onConnection(conn);
            socket.on('close', () => this.connections.delete(id));
        });

        await new Promise(resolve => this.server.listen(this.port, resolve()));
        logger.info(`TCP server listening on port ${this.port}`);
    }

    async stopServer() {
        if (!this.server) return;
        for (const [, conn] of this.connections) {
            try {
                conn.end();
            } catch (_) {

            }
        }
        await new Promise((resolve, reject) => {
            this.server.close(err => {
                if (err) reject();
                else resolve()
            })
        });
        logger.info('TcpServerAdapter: server stopped');
    }
}