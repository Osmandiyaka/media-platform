import jwt from "jsonwebtoken";

export default class Profile {
    constructor(firstname, lastname, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }

    getFullName() {
        return `${this.firstname} ${this.lastname}`;
    }

    toString() {
        return `${this.getFullName()} | ${this.email}`;
    }

    static loadProfileFromJwt(token) {
        const decoded = jwt.decode(token, { json: true });
        if (!decoded) {
            throw new Error("Invalid token");
        }

        const { firstName, lastName, acounts = [] } = decoded;
        const email = acounts[0]?.identifier ?? "unknown@email";
        return new Profile(firstName, lastName, email);
    }
}
