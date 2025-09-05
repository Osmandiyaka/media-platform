import fs from 'node:fs/promises';

export default class StreamReader {
    constructor() {

    }

    async readStream(chunk) {
        const handler = await fs.open('./data/sample.txt', 'w');
        const stream = handler.createWriteStream();
        return stream.write(chunk);
    }
}