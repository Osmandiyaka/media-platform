function format(level, message, ...args) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${args.length ? JSON.stringify(args) : ""
        }`;
}

export const logger = {
    info: (message, ...args) => console.log(format("info", message, ...args)),
    warn: (message, ...args) => console.warn(format("warn", message, ...args)),
    error: (message, ...args) => console.error(format("error", message, ...args)),
    debug: (message, ...args) => {
        if (process.env.DEBUG) {
            console.debug(format("debug", message, ...args));
        }
    },
};
