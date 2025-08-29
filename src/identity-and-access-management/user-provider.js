import db from './infrastructure/db.js';
import User from './user.js';

export default class UserProvider {
    constructor() {
        this.users = [];
    }

    async add(user) {
        db.data.users.push(user);
        await db.write();
        return Promise.resolve(user);
    }

    async getUser(userId) {
        const user = db.data.users.find(user => user.id === userId);
        return Promise.resolve(user || null);
    }

    async getUsers() {
        const users = db.data.users.map(User.fromJson);
        return Promise.resolve(users);
    }

    async findUserByAccount(provider, identifier) {
        let user = db.data.users.find(user =>
            user.accounts.some(account =>
                account.provider === provider && account.identifier === identifier
            )
        );

        user = User.fromJson(user);
        return Promise.resolve(user || null);
    }
}
