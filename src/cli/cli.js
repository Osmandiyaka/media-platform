import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import SignUpCommand from "./commands/signupcommand.js";
import SignInCommand from "./commands/signincommand.js";
import LogoutCommand from './commands/logoutcommand.js';
import { logger } from "../share/logger.js";
import SessionManager from "./session-manager.js";
import Profile from "./profile.js";
import AppEvent from '../share/event.js';

export default class Cli {
    constructor(userManager) {
        this.userManager = userManager;
        this.commandMap = {};
        AppEvent.on('command.logout', async () => this.init())
    }

    async init() {
        const tokenData = await SessionManager.loadToken();

        if (tokenData) {
            const profile = Profile.loadProfileFromJwt(tokenData.token);
            logger.info(`\n👤 User: ${profile.toString()} | Media Platform CLI`);
            this.setUserCommands();
        } else {
            logger.info("\n👋 Welcome to Media Platform CLI");
            this.setAnonymousCommands();
        }
    }

    setUserCommands() {
        this.commandMap = {
            logout: this.wrapCommand(LogoutCommand),
            "list user media": this.wrapCommand(SignInCommand),
            "upload media": this.wrapCommand(SignInCommand),
            delete: this.wrapCommand(SignInCommand),
        };
    }

    setAnonymousCommands() {
        this.commandMap = {
            signup: this.wrapCommand(SignUpCommand),
            signin: this.wrapCommand(SignInCommand),
        };
    }

    wrapCommand(CommandClass) {
        return (rl) => new CommandClass(rl, this.userManager);
    }

    async executeCommand(rl, selectedCommand) {
        const commandFactory = this.commandMap[selectedCommand];
        if (!commandFactory) {
            logger.warn(`❌ Unknown command: ${selectedCommand}`);
            return;
        }
        const command = commandFactory(rl);
        return await command.execute();
    }

    exit(rl) {
        rl.close();
        logger.info("👋 Goodbye");
        process.exit(0);
    }

    async run() {
        await this.init();
        const rl = readline.createInterface({ input, output });
        const commands = [...Object.keys(this.commandMap), "exit"].join(", ");

        while (true) {
            try {
                const command = (await rl.question(`\n👉 Select a command: [${commands}] \n`))
                    .trim()
                    .toLowerCase();

                if (command === "exit") return this.exit(rl);

                await this.executeCommand(rl, command);
            } catch (error) {
                logger.error(`💥 Unexpected error: ${error.message}`);
            }
        }
    }
}
