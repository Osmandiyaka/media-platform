import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const SESSION_FILE = path.join(os.homedir(), ".media-platform-session.json");

export default class SessionManager {
    static get filePath() {
        return SESSION_FILE;
    }

    static async isLoggedIn() {
        return !!(await this.loadToken());
    }

    static async saveToken(token) {
        const tokenData = { token, savedAt: new Date().toISOString() };
        await fs.writeFile(this.filePath, JSON.stringify(tokenData, null, 2));
    }

    static async loadToken() {
        try {
            const raw = await fs.readFile(this.filePath, "utf-8");
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    static async clearToken() {
        try {
            await fs.unlink(this.filePath);
        } catch {
        }
    }
}
