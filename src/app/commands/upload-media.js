export default class UploadMedia {
    constructor(storageAdapter, logger = console) {
        this.storageAdapter = storageAdapter;
        this.logger = logger;
    }


    async handle(conn, destinationKey) {
        this.logger.info(`UploadMedia: start handling conn ${conn.id}, writing to ${destinationKey}`);
        const ws = this.storageAdapter.createStream(destinationKey);

        ws.on('drain', () => {
            this.logger.debug(`Write stream drain for ${destinationKey} -> resuming conn ${conn.id}`);
            try { conn.resume() } catch (_) { }
        })

        ws.on('error', (err) => {
            this.logger.error(`Write stream error for ${destinationKey}: ${err.message}`);
            try { conn.end(); } catch (_) { }
        })

        conn.onData((chunk) => {
            try {
                const canWrite = ws.write(chunk);
                if (!canWrite) {
                    this.logger.debug(`Backpressure: pausing conn ${conn.id}`);
                    conn.pause();
                }
            } catch (error) {
                this.logger.error(`Error writing chunk: ${err.message}`);
                conn.end();
            }
        })

        conn.onClose(() => {
            this.logger.info(`Connection ${conn.id} closed -> ending stream ${destinationKey}`);
            ws.end();
        });

        conn.onError((err) => {
            this.logger.error(`Connection ${conn.id} error: ${err.message}`);
            ws.destroy(err);
        });

    }
}