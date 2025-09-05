import * as readline from "node:readline/promises";
import { stdin as input } from "node:process";
import { stdout as output } from "process";

import SignUpCommand from "./commands/signupcommand.js";
import SignInCommand from "./commands/signincommand.js";
import LogoutCommand from "./commands/logoutcommand.js";
import { logger } from "../share/logger.js";
import SessionManager from "./session-manager.js";
import Profile from "./profile.js";
import AppEvent from "../share/event.js";
import { errorBanner, successBanner, infoBanner, clearScreen, renderHeader, renderMenu, ANSI } from "./cli-util.js";


export default class Cli {
    constructor({ userManager, tcpServer, commands = {} }) {
        this.userManager = userManager;
        this.tcpServer = tcpServer;
        this.commandMap = commands
        this._shortMap = new Map();
        AppEvent.on("command.logout", () => this.refresh());
        AppEvent.on("command.signin", () => this.refresh());
    }

    async refresh() {
        await this.init();
    }

    async init() {
        await this.tcpServer.startServer();
        const tokenData = await SessionManager.loadToken();
        this.profile = null;
        if (tokenData) {
            try {
                this.profile = Profile.loadProfileFromJwt(tokenData.token);
            } catch (err) {
                logger.warn("Invalid session token, clearing session.");
                await SessionManager.clearToken();
                this.profile = null;
            }
        }

        if (this.profile) {
            this.setUserCommands();
        } else {
            this.setAnonymousCommands();
        }
    }

    setUserCommands() {
        const cmds = [
            { key: "o", name: "logout", desc: "Sign out of your account", factory: this.wrapCommand(LogoutCommand) },
            { key: "l", name: "list media", desc: "List your uploaded media", factory: this.wrapCommand(SignInCommand) },
            { key: "u", name: "upload", desc: "Upload a media file", factory: this.wrapCommand(SignInCommand) },
            { key: "d", name: "delete", desc: "Delete media by id", factory: this.wrapCommand(SignInCommand) },
        ];
        this._applyCommandList(cmds);
    }

    setAnonymousCommands() {
        const cmds = [
            { key: "s", name: "signup", desc: "Create a new account", factory: this.wrapCommand(SignUpCommand) },
            { key: "i", name: "signin", desc: "Sign in to your account", factory: this.wrapCommand(SignInCommand) },
        ];
        this._applyCommandList(cmds);
    }

    _applyCommandList(cmds) {
        this.commandMap = {};
        this._shortMap.clear();

        for (const c of cmds) {
            this.commandMap[c.name] = c.factory;
            if (c.key) this._shortMap.set(c.key, c.name);
        }

        this._menuEntries = cmds.map(c => ({ key: c.key, name: c.name, desc: c.desc }));
    }

    wrapCommand(CommandClass) {
        return (rl) => new CommandClass(rl, this.userManager);
    }

    async executeCommand(rl, selectedCommand) {
        const normalized = selectedCommand.trim().toLowerCase();
        const maybeKey = normalized.length === 1 ? this._shortMap.get(normalized) : normalized;
        const commandName = maybeKey || normalized;

        const commandFactory = this.commandMap[commandName];
        if (!commandFactory) {
            console.log(errorBanner("Unknown command — please try again."));
            return;
        }
        const command = commandFactory(rl);
        try {
            const res = await command.execute();
            if (res && res.message) {
                console.log(successBanner(res.message));
            }
        } catch (err) {
            console.log(errorBanner(err.message || "Command failed"));
        }
    }

    exit(rl) {
        rl.close();
        console.log(infoBanner("Goodbye 👋"));
        process.exit(0);
    }

    async run() {
        await this.init();
        const rl = readline.createInterface({ input, output, terminal: true });

        while (true) {
            clearScreen();
            console.log(renderHeader(this.profile));
            console.log(renderMenu(this._menuEntries));

            try {
                const promptStr = `${ANSI.bold}${ANSI.fg.yellow}Command${ANSI.reset} › `;
                const answer = (await rl.question(promptStr)).trim();

                if (!answer) {
                    continue;
                }

                if (answer.toLowerCase() === "exit" || answer.toLowerCase() === "q") {
                    return this.exit(rl);
                }

                await this.executeCommand(rl, answer);
                await sleep(250);
            } catch (error) {
                logger.error(`Unexpected CLI error: ${error.message}`);
                console.log(errorBanner(error.message));
                await sleep(300);
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
