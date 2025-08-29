
export function assertEmail(email) {
    const trimmed = email.trim().toLowerCase();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(trimmed)) {
        throw new Error("Invalid email format");
    }

    return trimmed;
}

export function assertPassword(password) {
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        throw new Error("Password must contain at least one letter and one number");
    }

    return password;
}
