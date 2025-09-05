import { stdout as output } from "process";

export const ANSI = {
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
export function clearScreen() {
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
export function renderHeader(profile = null) {
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
export function renderMenu(commands) {
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
export function successBanner(msg) {
    return `${ANSI.fg.green}${ANSI.bold}✔ ${msg}${ANSI.reset}`;
}
export function errorBanner(msg) {
    return `${ANSI.fg.red}${ANSI.bold}✖ ${msg}${ANSI.reset}`;
}
export function infoBanner(msg) {
    return `${ANSI.fg.blue}${ANSI.bold}» ${msg}${ANSI.reset}`;
}
