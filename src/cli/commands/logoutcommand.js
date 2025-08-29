import Command from './command.js';
import SessionManager from '../session-manager.js';
import { logger } from '../../share/logger.js';
import AppEvent from '../../share/event.js';

export default class LogoutCommand extends Command {
    constructor(rl, userManager) {
        super(rl);
    }

    async handle() {
        logger.info('Loggin user out')
        await SessionManager.clearToken();
        AppEvent.emit('command.logout');
    }
}