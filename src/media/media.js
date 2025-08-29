import { randomUUID } from "node:crypto";
import Domain from "../share/domain.js";
import { logger } from "../share/logger.js";

export default class MediaFile extends Domain {
    constructor(filename, uploaderId, size, mimeType) {
        super();

        this.id = randomUUID();
        this.filename = filename;
        this.uploaderId = uploaderId;
        this.size = size;
        this.mimeType = mimeType;
        this.uploadDate = new Date().toISOString();
        this.status = "uploaded"; // could be: uploaded, processing, ready, deleted
        this.metadata = {}; // extra details (duration, resolution, etc.)

        this.subscribeToEvent("media.deleted", (data) => {
            logger.info(`🗑 Media deleted: ${data.id}`);
        });
    }

    setMetadata(metadata) {
        this.metadata = { ...this.metadata, ...metadata };
    }

    markDeleted() {
        this.status = "deleted";
        this.raiseEvent("media.deleted", this.toJson());
    }

    getInfo() {
        return {
            id: this.id,
            filename: this.filename,
            uploaderId: this.uploaderId,
            size: this.size,
            mimeType: this.mimeType,
            uploadDate: this.uploadDate,
            status: this.status,
            metadata: this.metadata
        };
    }

    toJson() {
        return this.getInfo();
    }

    static fromJson(json) {
        const media = new MediaFile(
            json.filename,
            json.uploaderId,
            json.size,
            json.mimeType
        );
        media.id = json.id;
        media.uploadDate = json.uploadDate;
        media.status = json.status;
        media.metadata = json.metadata || {};
        return media;
    }
}
