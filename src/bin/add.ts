import * as api from "../api";
import {logger} from "../logger";

import * as path from "path";
import * as fs from "fs";

import {OptionSet} from "@koschel-christoph/node.options";

export default function add(args: string[]): number {
    let serverFile: string = path.join(process.cwd(), "ksm.json");
    let help: boolean = false;
    let start: boolean = false;
    const option: OptionSet = new OptionSet(
        "Usage: ksm add [<>] [<options>]",
        ["<>", "Path to a config file", v => serverFile = v],
        ["start", "Starts the server", () => start = true],
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

    const serverConfig: api.ServerConfig = api.configuration.readServerConfig(serverFile);
    const config: api.Config = api.configuration.readConfig();
    const serverlist: api.Serverlist = api.configuration.readServerlist();

    if (api.controller.serverExistInConfig(serverFile, serverlist)) {
        logger.error("Server already added.");
        return 0;
    }

    serverlist.push({
        path: serverFile,
        pid: start ? api.controller.spawnServer(serverFile, serverConfig, config) : -1
    });

    api.configuration.writeServerlist(serverlist);
    return 0;
}

