import MediaFile from "./media.js";

export default class VideoFile extends MediaFile {
    constructor(filename, uploaderId, size, mimeType = "video/mp4", resolution, duration = null) {
        super(filename, uploaderId, size, mimeType);
        this.resolution = resolution; // e.g. "1920x1080"
        this.duration = duration; // seconds, optional
    }

    getInfo() {
        return {
            ...super.getInfo(),
            resolution: this.resolution,
            duration: this.duration
        };
    }

    toJson() {
        return this.getInfo();
    }

    static fromJson(json) {
        const video = new VideoFile(
            json.filename,
            json.uploaderId,
            json.size,
            json.mimeType,
            json.resolution,
            json.duration
        );
        video.id = json.id;
        video.uploadDate = json.uploadDate;
        video.status = json.status;
        video.metadata = json.metadata || {};
        return video;
    }
}
