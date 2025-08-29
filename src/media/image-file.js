import MediaFile from "./media.js";

export default class ImageFile extends MediaFile {
    constructor(filename, uploaderId, size, mimeType = "image/jpeg", resolution = null, format = null) {
        super(filename, uploaderId, size, mimeType);
        this.resolution = resolution; // e.g. "1080x720"
        this.format = format;         // e.g. "jpg", "png"
    }

    getInfo() {
        return {
            ...super.getInfo(),
            resolution: this.resolution,
            format: this.format
        };
    }

    toJson() {
        return this.getInfo();
    }

    static fromJson(json) {
        const image = new ImageFile(
            json.filename,
            json.uploaderId,
            json.size,
            json.mimeType,
            json.resolution,
            json.format
        );
        image.id = json.id;
        image.uploadDate = json.uploadDate;
        image.status = json.status;
        image.metadata = json.metadata || {};
        return image;
    }
}
