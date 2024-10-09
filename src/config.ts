import {validator} from "./validator";
import {logger} from "./logger";
import {handleException} from "./utils";
import {Config, ServerConfig, Serverlist} from "./api";

import fs from "fs";
import path from "path";

export namespace configuration {
    export const CONFIG_PATH: string = "/etc/ksm/config.json";
    export const SERVER_PATH: string = "/etc/ksm/serverlist";

    export function readConfig(): Config {
        try {
            const f = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
            validator.validateConfig(f);
            return f;
        } catch (e) {
            logger.error("Cannot read file: " + e);
            handleException(e);
        }
    }

    export function writeConfig(config: Config): void {
        try {
            validator.validateConfig(config);
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
        } catch (e) {
            logger.error("Cannot write file: " + e);
            handleException(e);
        }
    }

    export function readServerlist(): Serverlist {
        try {
            const f = JSON.parse(fs.readFileSync(SERVER_PATH, "utf8"));
            validator.validateServerlist(f);
            return f;
        } catch (e) {
            logger.error("Cannot read file: " + e);
            handleException(e);
        }
    }

    export function writeServerlist(serverlist: Serverlist): void {
        try {
            validator.validateServerlist(serverlist);
            fs.writeFileSync(SERVER_PATH, JSON.stringify(serverlist, null, 4));
        } catch (e) {
            logger.error("Cannot write file: " + e);
            handleException(e);
        }
    }

    export function readServerConfig(path: string): ServerConfig {
        try {
            const f = JSON.parse(fs.readFileSync(path, "utf8"));
            validator.validateServerConfig(f);
            return f;
        } catch (e) {
            logger.error("Cannot read file: " + e);
            handleException(e);
        }
    }

    export function writeServerConfig(path: string, serverConfig: ServerConfig): void {
        try {
            validator.validateServerConfig(serverConfig);
            fs.writeFileSync(path, JSON.stringify(serverConfig, null, 4));
        } catch (e) {
            logger.error("Cannot write file: " + e);
            handleException(e);
        }
    }

    export function writeService(fid: string, content: string): void {
        try {
            fs.writeFileSync(path.join("/etc/systemd/system/", fid + ".service"), content);
        } catch (e) {
            logger.error("Cannot write file: " + e);
            handleException(e);
        }
    }

    export function deleteService(fid: string): void {
        try {
            fs.unlinkSync(path.join("/etc/systemd/system/", fid + ".service"));
        } catch (e) {
            logger.error("Cannot delete file: " + e);
            handleException(e);
        }
    }
}