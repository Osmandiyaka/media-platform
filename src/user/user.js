import Account from './account.js';
import Domain from './domain.js';
import { logger } from '../share/logger.js';

export default class User extends Domain {
    constructor(firstName, lastName,) {
        super();

        this.firstName = firstName;
        this.lastName = lastName;
        this.accounts = [];
        this.uploads = [];
        this.playlists = [];
        this.isAdmin = false;
        this.createdAt = new Date();

        this.subscribeToEvent('user.account.createdsss', (data) => {
            logger.info('user created with', data);
        })


    }

    static fromJson(json) {
        if (!json) return null;

        const user = new User(json.firstName, json.lastName);
        user.isAdmin = json.isAdmin ?? false;
        user.createdAt = new Date(json.createdAt);

        user.accounts = (json.accounts || []).map(
            acc => Account.fromJson(acc)
        );

        user.uploads = [...(json.uploads || [])];
        user.playlists = [...(json.playlists || [])];

        return user;
    }


    addAccount(provider, identifier, passwordHash = null) {
        const account = new Account(provider, identifier, passwordHash);
        this.accounts.push(account);

        const createdUser = this.toJson();
        this.raiseEvent('user.account.created', createdUser)
    }

    getAccount(provider) {
        return this.accounts.find(account => account.provider === provider);
    }

    removeAccount(provider) {
        this.accounts = this.accounts.filter(account => account.provider !== provider);
        this.raiseEvent('user.account.removed', this.toJson());
    }

    upload(mediaId) {
        this.uploads.push(mediaId);
        this.raiseEvent('user.media.upload', this.toJson())
    }

    addToPlaylist(mediaId) {
        this.playlists.puhsh(mediaId);
        this.raiseEvent('user.playlist.add', this.toJson())
    }

    toJson() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            acounts: this.accounts.map(account => account.toJson()),
            uploads: this.uploads,
            playlist: this.playlist,
            isAdmin: this.isAdmin,
            createdAt: this.createdAt
        }
    }
}