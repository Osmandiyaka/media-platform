import { stdin as input, stdout as output } from 'node:process';

export async function maskInput(readline, message, validator = null) {
    return new Promise((resolve) => {
        output.write(`${message} \n`);
        input.setRawMode(true);
        input.resume();
        input.setEncoding("utf8");

        let value = "";

        const onData = (char) => {
            if (char === "\n" || char === "\r" || char === "\u0004") { // Enter or Ctrl+D
                input.setRawMode(false);
                input.removeListener("data", onData);

                if (validator && !validator(value)) {
                    console.log("❌ Invalid input, try again");
                    resolve(maskInput(readline, message, validator));
                } else {
                    output.write("\n");
                    resolve(value);
                }
            } else if (char === "\u0003") { // Ctrl+C
                process.exit();
            } else {
                value += char;
                output.write("*"); // mask
            }
        };

        input.on("data", onData);
    });
}
