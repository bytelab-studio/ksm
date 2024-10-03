import * as path from "path";
import * as fs from "fs";

class Logger {
    private stream: fs.WriteStream;

    public constructor(file: string) {
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
            fs.mkdirSync(path.dirname(file), {recursive: true});
        }

        this.stream = fs.createWriteStream(file, {
            flags: "a"
        });
        this.stream.on("error", err => {
            throw err;
        });
    }

    private write(message: string | number): void {
        if (typeof message == "number") {
            message = message.toString();
        }

        console.log(message);
        this.stream.write(Buffer.from(`${new Date()} ${message}\n`, "utf8"));
    }

    public log(message: string | number): void {
        this.write("LOG: " + message);
    }

    public error(message: string | number): void {
        this.write("ERROR: " + message);
    }

    public warning(message: string | number): void {
        this.write("ERROR: " + message);
    }

    public dispose(): void {
        this.stream.close();
    }
}

export const logger: Logger = new Logger("/var/log/ksm/cli.log");