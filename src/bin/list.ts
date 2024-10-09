import {logger} from "../logger";
import * as api from "../api";

import {OptionSet} from "@koschel-christoph/node.options";

export default function list(args: string[]): number {
    let help: boolean = false;
    const option: OptionSet = new OptionSet(
        "Usage: ksm list [<options>]",
        ["h|help", "Prints this help string", () => help = true]
    );
    option.parse(args, false);
    if (help) {
        option.printHelpString(process.stdout);
        return 0;
    }

    const serverlist: api.Serverlist = api.configuration.readServerlist();
    serverlist.forEach(s => logger.log(`${s.path} :: ${s.fid}`));

    return 0;
}