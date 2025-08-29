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

    toJson() {
        return {
            provider: this.provider,
            identifier: this.identifier,
            createdAt: this.createdAt,
            lastLogin: this.lastLogIn
        }
    }
}