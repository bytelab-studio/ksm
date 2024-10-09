#!/usr/bin/env node
import {logger} from "../logger";
import * as api from "../api";
import list from "./list";
import install from "./install";
import uninstall from "./uninstall";
import start from "./start";

if (process.geteuid == null || process.geteuid() != 0) {
    logger.error("KSM must be run with root privileges")
    process.exit(1);
}

api.enableCLIMode();

process.on("exit", () => {
    logger.dispose()
});

process.argv.shift()
process.argv.shift()
const command: string | undefined = process.argv.shift();

if (command == "list") {
    process.exit(list(process.argv));
}
if (command == "install") {
    process.exit(install(process.argv));
}
if (command == "uninstall") {
    process.exit(uninstall(process.argv));
}
if (command == "start") {
    process.exit(start(process.argv));
}

console.log("Usage: kms <command> [<options>]");

if (!!command) {
    console.log(`Unknown command '${command}'`);
}
process.exit(1);
