import AppEvent from '../share/event.js';

export default class Domain {
    constructor() {
    }

    raiseEvent(event, eventData) {
        AppEvent.emit(event, eventData)
    }

    subscribeToEvent(event, callback) {
        AppEvent.on(event, callback)
    }
}