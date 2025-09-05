import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../../share/logger.js';

export default class FileStorage {
    constructor({ baseDir = './data/uploads' } = {}) {
        this.baseDir = baseDir;
    }


    createStream(key) {
        const safeKey = key.replace(/(^\/+|(\.\.)+)/g, '');
        const filePath = path.join(this.baseDir, safeKey);
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true })
        logger.info(`FileStorageAdapter: will write to ${filePath}`);
        return fs.createWriteStream(filePath, { flags: 'w' })
    }

}