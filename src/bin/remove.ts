import {logger} from "../logger";
import * as api from "../api";

import path from "path";
import fs from "fs";

import {OptionSet} from "@koschel-christoph/node.options";

export default function remove(args: string[]): number {
    let serverFile: string = path.join(process.cwd(), "ksm.json");
    let help: boolean = false;
    const option: OptionSet = new OptionSet(
        "Usage: ksm remove [<>] [<options>]",
        ["<>", "Path to a config file", v => serverFile = v],
        ["h|help", "Prints this help string", () => help = true]
    );

    option.parse(args, false);
    if (help) {
        option.printHelpString(process.stdout);
        return 0;
    }

    if (!path.isAbsolute(serverFile)) {
        serverFile = path.join(process.cwd(), serverFile);
    }

    if (!fs.existsSync(serverFile) || !fs.statSync(serverFile).isFile()) {
        logger.error(`Invalid config file: '${serverFile}'`);
        return 1;
    }

    const serverlist: api.Serverlist = api.configuration.readServerlist();
    const entry: api.ServerEntry | undefined = serverlist.find(s => s.path == serverFile);

    if (!entry) {
        logger.error("The server was not added.")
        return 1;
    }
    if (entry.pid == -1) {
        logger.warning("The server is not running");
    } else {
        api.controller.killServer(serverFile, entry.pid);
    }

    api.configuration.writeServerlist(serverlist.filter(s => s != entry));
    return 0;
}