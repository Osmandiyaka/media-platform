import Video from './video-file';
import Audio from './audio-file';
import Image from './image-file';

export default class MediaFactory {
    static create(type, filename, uploaderId, size, extra = {}) {
        switch (type.toLowerCase()) {
            case 'video':
                return new Video(filename, uploaderId, size, extra.mimeType, extra.resolution, extra.duration);
            case 'audio':
                return new Audio(filename, uploaderId, size, extra.mimeType, extra.duration, extra.bitrate);
            case 'image':
                return new Image(filename, uploaderId, size, extra.mimeType, extra.resolution, extra.format);
            default: throw new Error('Unsupported media type: ' + type);
        }
    }
}