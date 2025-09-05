import Storage from './src/adapters/storage/storage.js';
import TcpServer from './src/adapters/tcp/tcp-server.js';
import MediaUpload from './src/app/commands/upload-media.js';
import { logger } from './src/share/logger.js';
import UserManager from './src/user/user-manager.js';
import UserProvider from './src/user/user-provider.js';

export default function buildContainer(config) {
    const storage = new Storage(config.STORAGE_CONFIGURATION.baseDir);
    const uploader = new MediaUpload(storage, logger);
    const userProvider = new UserProvider();
    const userManager = new UserManager(userProvider);

    async function onConnection(conn) {
        logger.info(`Incoming connection ${conn.id}`);
        const key = `uploads/${Date.now()}-${conn.id}.bin`;
        await uploader.handle(conn, key);
    }

    const tcpServer = new TcpServer({ onConnection });
    return { userManager, tcpServer };
}