import {logger} from "../logger";
import * as api from "../api";

import {OptionSet} from "@koschel-christoph/node.options";


export default function start(args: string[]): number {
    let fid: string;
    let help: boolean = false;

    const option: OptionSet = new OptionSet(
        "Usage: ksm start [<>] [<options>]",
        ["<>", "FID of the service", v => fid = v],
        ["h|help", "Prints this help string", () => help = true]
    );
    option.parse(args, false);
    if (help) {
        option.printHelpString(process.stdout);
        return 0;
    }

    const serverlist: api.Serverlist = api.configuration.readServerlist();
    const entry: api.ServerEntry | undefined = serverlist.find(s => s.fid == fid);
    if (!entry) {
        logger.error("The server is not installed.")
        return 1;
    }
    const config: api.Config = api.configuration.readConfig();
    const serverConfig: api.ServerConfig = api.configuration.readServerConfig(entry.path);

    return api.controller.spawnServer(entry.path, serverConfig, config);
}