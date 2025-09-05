export default class Account {
    constructor(provider, identifier, passwordHash = null) {
        this.provider = provider;
        this.identifier = identifier;
        this.passwordHash = passwordHash;
        this.createdAt = new Date();
        this.lastLogin = null;
    }

    updateLastLogin() {
        this.lastLogin = new Date();
    }

    static fromJson(json) {
        if (!json) throw new Error("Invalid JSON for Account");

        const acc = new Account(
            json.provider,
            json.identifier,
            json.passwordHash ?? null
        );

        acc.createdAt = json.createdAt ? new Date(json.createdAt) : new Date();
        acc.lastLogin = json.lastLogin ? new Date(json.lastLogin) : null;

        return acc;
    }

    toJson() {
        return {
            provider: this.provider,
            identifier: this.identifier,
            createdAt: this.createdAt,
            lastLogin: this.lastLogIn
        }
    }
}