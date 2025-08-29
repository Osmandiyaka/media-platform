import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import SignUpCommand from "./commands/signupcommand.js";
import SignInCommand from "./commands/signincommand.js";
import LogoutCommand from "./commands/logoutcommand.js";
import { logger } from "../share/logger.js";
import SessionManager from "./session-manager.js";
import Profile from "./profile.js";
import AppEvent from "../share/event.js";


const ANSI = {
    reset: "\u001b[0m",
    bold: "\u001b[1m",
    dim: "\u001b[2m",
    underscore: "\u001b[4m",
    reverse: "\u001b[7m",
    fg: {
        red: "\u001b[31m",
        green: "\u001b[32m",
        yellow: "\u001b[33m",
        blue: "\u001b[34m",
        magenta: "\u001b[35m",
        cyan: "\u001b[36m",
        white: "\u001b[37m",
    },
    bg: {
        blue: "\u001b[44m",
        cyan: "\u001b[46m",
    },
};

function clearScreen() {
    output.write("\u001b[2J\u001b[0;0H");
}

function horizontalRule(width = 60) {
    return "─".repeat(width);
}

function centerText(text, width = 60) {
    const pad = Math.max(0, Math.floor((width - stripAnsi(text).length) / 2));
    return " ".repeat(pad) + text;
}

function stripAnsi(s = "") {
    return s.replace(/\u001b\[[0-9;]*m/g, "");
}


function renderHeader(profile = null) {
    const width = 72;
    const title = `${ANSI.bold}${ANSI.fg.cyan}Media Platform CLI${ANSI.reset}`;
    const left = centerText(title, width);
    const rule = horizontalRule(width);

    let userLine = `${ANSI.dim}Not signed in${ANSI.reset}`;
    if (profile) {
        userLine = `${ANSI.fg.green}${profile.toString()}${ANSI.reset}`;
    }

    const userLineCentered = centerText(userLine, width);

    return [
        `┌${"─".repeat(width)}┐`,
        `│${left}${" ".repeat(width - stripAnsi(left).length)}│`,
        `│${" ".repeat(width)}│`,
        `│${userLineCentered}${" ".repeat(width - stripAnsi(userLineCentered).length)}│`,
        `└${"─".repeat(width)}┘`,
    ].join("\n");
}


function renderMenu(commands) {
    const width = 72;
    const lines = [];
    lines.push("");
    lines.push(`${ANSI.bold}Available commands${ANSI.reset}`);
    lines.push(horizontalRule(72));
    for (const cmd of commands) {
        const key = `${ANSI.bg.cyan}${ANSI.fg.white} ${cmd.key} ${ANSI.reset}`;
        const name = `${ANSI.bold}${cmd.name}${ANSI.reset}`;
        const desc = `${ANSI.dim}${cmd.desc}${ANSI.reset}`;
        const left = `${key}  ${name}`;
        const pad = Math.max(2, 30 - stripAnsi(left).length);
        const line = `${left}${" ".repeat(pad)}${desc}`;
        lines.push(line);
    }
    lines.push("");
    lines.push(`${ANSI.dim}Type the command name or its single-letter key, then press Enter.${ANSI.reset}`);
    return lines.join("\n");
}


function successBanner(msg) {
    return `${ANSI.fg.green}${ANSI.bold}✔ ${msg}${ANSI.reset}`;
}
function errorBanner(msg) {
    return `${ANSI.fg.red}${ANSI.bold}✖ ${msg}${ANSI.reset}`;
}
function infoBanner(msg) {
    return `${ANSI.fg.blue}${ANSI.bold}» ${msg}${ANSI.reset}`;
}


export default class Cli {
    constructor(userManager) {
        this.userManager = userManager;
        this.commandMap = {};
        this._shortMap = new Map();
        AppEvent.on("command.logout", () => this.refresh());
        AppEvent.on("command.signin", () => this.refresh());
    }

    async refresh() {
        await this.init();
    }

    async init() {
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
