import Command from './command.js';
import { logger } from '../../share/logger.js';
import { assertEmail, assertPassword } from '../../share/validation.js';

export default class SignupCommand extends Command {
    constructor(readline, userManager) {
        super(readline, userManager);
    }

    async handle() {
        logger.info("📝 User Signup");

        const firstname = await this.prompt("First name >");
        const lastname = await this.prompt("Last name >");
        const email = await this.prompt("Email >", assertEmail);

        const password = await this.prompt("Password >", assertPassword);

        await this.userManager.createUser(firstname, lastname, email, password);
        logger.info(`✅ User created: ${email}`);
    }
}
