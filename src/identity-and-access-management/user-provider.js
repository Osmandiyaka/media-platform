export default class UserProvider {
    constructor() {
        this.users = [];
    }

    async add(user) {
        this.users.push(user);
        return Promise.resolve(user);
    }

    async getUser(userId) {
        const user = this.users.find(user => user.id === userId);
        return Promise.resolve(user || null);
    }

    async getUsers() {
        const users = this.users.map(user => user.toJson());
        return Promise.resolve(users);
    }

    async findUserByAccount(provider, identifier) {
        const user = this.users.find(user =>
            user.accounts.some(account =>
                account.provider === provider && account.identifier === identifier
            )
        );
        return Promise.resolve(user || null);
    }
}
