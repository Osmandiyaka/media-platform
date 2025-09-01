import Video from './video-file';
import Audio from './audio-file';
import Image from './image-file';

export class MediaProcessor {
    constructor() {

    }

    static async process(mediaFile) {
        if (mediaFile instanceof Video) {
            return this.processVideo(mediaFile);
        }
        if (mediaFile instanceof Audio) {
            return this.processAudio(mediaFile);
        }
        if (mediaFile instanceof Image) {
            return this.processImage(mediaFile);
        }
    }


    static async processVideo(video) {
        console.log(`🎬 Processing video: ${video.filename}`);
    }

    static async processAudio(audio) {
        console.log(`🎵 Processing audio: ${audio.filename}`);
    }

    static async processImage(image) {
        console.log(`🖼️ Processing image: ${image.filename}`);
    }
}