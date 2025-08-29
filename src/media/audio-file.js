import MediaFile from "./media.js";

export default class AudioFile extends MediaFile {
    constructor(filename, uploaderId, size, mimeType = "audio/mpeg", duration = null, bitrate = null) {
        super(filename, uploaderId, size, mimeType);
        this.duration = duration; // seconds
        this.bitrate = bitrate;   // kbps
    }

    getInfo() {
        return {
            ...super.getInfo(),
            duration: this.duration,
            bitrate: this.bitrate
        };
    }

    toJson() {
        return this.getInfo();
    }

    static fromJson(json) {
        const audio = new AudioFile(
            json.filename,
            json.uploaderId,
            json.size,
            json.mimeType,
            json.duration,
            json.bitrate
        );
        audio.id = json.id;
        audio.uploadDate = json.uploadDate;
        audio.status = json.status;
        audio.metadata = json.metadata || {};
        return audio;
    }
}
