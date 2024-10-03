#!/usr/bin/env node
import {logger} from "../logger";
import * as api from "../api";
import add from "./add";
import remove from "./remove";
import list from "./list";

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
if (command == "add") {
    process.exit(add(process.argv));
}
if (command == "remove") {
    process.exit(remove(process.argv));
}

console.log("Usage: kms <command> [<options>]");

if (!!command) {
    console.log(`Unknown command '${command}'`);
}
process.exit(1);
