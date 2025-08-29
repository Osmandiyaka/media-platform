import { logger } from "../../share/logger.js";

export default class Command {
    constructor(readline, userManager) {
        this.readline = readline;
        this.userManager = userManager;
    }

    async prompt(message, validator = null) {
        let value;
        while (true) {
            value = (await this.readline.question(`${message} \n`)).trim();
            if (!validator || validator(value)) {
                break;
            }
            logger.error("❌ Invalid input, try again");
        }
        return value;
    }

    async execute() {
        try {
            return await this.handle();
        } catch (err) {
            logger.error(err.message);
        }
    }

    async handle() {
        throw new Error("handle() must be implemented in subclass");
    }
}
