import {Config, ServerConfig, Serverlist} from "./api";

export namespace validator {
    export function validateServerlist(server: Serverlist): void {
        for (let i: number = 0; i < server.length; i++) {
            if (typeof server[i].path != "string") {
                throw new Error("Invalid file format");
            }
            if (typeof server[i].pid != "number") {
                throw new Error("Invalid file format");
            }
        }
    }

    export function validateConfig(config: Config): void {
        for (const key in config.env) {
            const type: "boolean" | "number" | "string" | string = typeof config.env[key];
            if (type != "string" && type != "number" && type != "boolean") {
                throw new Error("Invalid file format");
            }
        }
    }

    export function validateServerConfig(serverConfig: ServerConfig): void {
        if (typeof serverConfig.cwd != "string") {
            throw new Error("Invalid file format (cwd)");
        }
        if (typeof serverConfig.ports.http != "number" || Math.round(serverConfig.ports.http) != serverConfig.ports.http) {
            throw new Error("Invalid file format (ports.http)");
        }
        if (typeof serverConfig.ports.https != "number" || Math.round(serverConfig.ports.https) != serverConfig.ports.https) {
            throw new Error("Invalid file format (ports.https)");
        }
        for (let i: number = 0; i < serverConfig.command.length; i++) {
            if (typeof serverConfig.command[i] != "string") {
                throw new Error("Invalid file format (command)");
            }
        }
        for (const key in serverConfig.env) {
            const type: "boolean" | "number" | "string" | string = typeof serverConfig.env[key];
            if (type != "string" && type != "number" && type != "boolean") {
                throw new Error(`Invalid file format (env.${key})`);
            }
        }
    }
}