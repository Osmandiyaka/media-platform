export default class MediaRepository {
    constructor(db, storage) {
        this.db = db;
        this.storage = storage;
    }

    async save(mediaFile, binaryContent) {
        await this.storage.save(mediaFile.filename, binaryContent);
        await this.db.save(mediaFile.toJson())
    }

    async findById(id) {
        const mediaFile = await this.db.findById(id);
        return mediaFile;
    }
}