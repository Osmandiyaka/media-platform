import bcrypt from 'bcrypt';
import User from './user.js';
import jwt from 'jsonwebtoken';

export default class UserManager {
    constructor(usersProvider) {
        this.usersProvider = usersProvider;
    }

    async createUser(firstName, lastName, email, password) {
        const user = new User(firstName, lastName);
        const passwordHash = await bcrypt.hash(password, 10);
        user.addAccount('local', email, passwordHash);

        await this.usersProvider.add(user);
        return user;
    }

    linkAccount(user, provider, identifier) {
        if (user.getAccount(provider)) {
            throw new Error(`User already has ${provider} account linked`);
        }
        return user.addAccount(provider, identifier);
    }

    unLinkAccount(user, provider) {
        const account = user.getAccount(provider);
        if (!account) throw new Error(`Account with provider ${provider} does not exist`);
        user.removeAccount(provider);
    }

    async findUserByAccount(provider, identifier) {
        return await this.usersProvider.findUserByAccount(provider, identifier);
    }

    async listUsers() {
        return await this.usersProvider.getUsers();
    }

    async authenticateLocal(email, password) {
        const user = await this.findUserByAccount('local', email);
        if (!user) throw new Error('User does not exist');

        const account = user.getAccount('local');
        const valid = await bcrypt.compare(password, account.passwordHash);
        if (!valid) throw new Error('Invalid username or password');

        account.updateLastLogin();

        const token = jwt.sign(user.toJson(), 'secrete');
        return { token };
    }
}
