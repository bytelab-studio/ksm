import {logger} from "../logger";
import * as api from "../api";

import * as path from "path";
import * as fs from "fs";

import {OptionSet} from "@koschel-christoph/node.options";

export default function uninstall(args: string[]): number {
    let serverFile: string = path.join(process.cwd(), "ksm.json");
    let help: boolean = false;

    const option: OptionSet = new OptionSet(
        "Usage: ksm uninstall [<>] [<options>]",
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
        logger.error("Server is not installed.");
        return 0;
    }

    api.configuration.writeServerlist(serverlist.filter(s => s != entry));
    api.controller.stopService(entry.fid);
    api.configuration.deleteService(entry.fid);
    return 0;
}