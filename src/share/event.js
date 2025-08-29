import * as Event from 'events';

class AppEvent extends Event.EventEmitter {
    constructor() {
        super();
    }
}

export default new AppEvent();


