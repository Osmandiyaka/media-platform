import Command from './command.js';
import { logger } from '../../share/logger.js';
import { assertEmail } from '../../share/validation.js';
import SessionManager from '../session-manager.js';
import AppEvent from '../../share/event.js';

export default class SignInCommand extends Command {
    constructor(readline, userManager) {
        super(readline, userManager);
    }

    async handle() {
        logger.info("🔑 User Sign In");

        const email = await this.prompt("Email >", assertEmail);
        const password = await this.prompt("Password >");

        const authenticationResult = await this.userManager.authenticateLocal(email, password);
        SessionManager.saveToken(authenticationResult.token);
        AppEvent.emit('command.signin')
    }
}
