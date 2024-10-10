import {logger} from "../logger";
import * as api from "../api";

import * as path from "path";
import * as fs from "fs";

import {OptionSet} from "@koschel-christoph/node.options";

function generate_unique_filename(directory: string, prefix: string, extension: string, maxRetries: number = -1) {
    let randomString = () => Math.random().toString(36).substring(2, 15); // Generate random string
    let attempt: number = 0;

    while (maxRetries == -1 || attempt < maxRetries) {
        const fileName: string = prefix + randomString();
        const filePath: string = path.join(directory, fileName) + extension;

        if (!fs.existsSync(filePath)) {
            return fileName;
        }

        attempt++;
    }

    throw new Error("Could not generate a unique file name after several attempts.");
}

export default function install(args: string[]): number {
    let serverFile: string = path.join(process.cwd(), "ksm.json");
    let help: boolean = false;
    let start: boolean = false;
    let user: string = "root";
    let group: string = "root";

    const option: OptionSet = new OptionSet(
        "Usage: ksm install [<>] [<options>]",
        ["<>", "Path to a config file", v => serverFile = v],
        ["start", "Starts the server", () => start = true],
        ["user=", "Sets the executing {user}", v => user = v],
        ["group=", "Sets the executing {group}", v => group = v],
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

    api.configuration.readServerConfig(serverFile);
    const serverlist: api.Serverlist = api.configuration.readServerlist();

    if (api.controller.serverExistInConfig(serverFile, serverlist)) {
        logger.error("Server already installed.");
        return 0;
    }

    const fid: string = generate_unique_filename("/etc/systemd/system/", "ksm_", ".service")

    serverlist.push({
        path: serverFile,
        fid: fid
    });

    const template: string = `[Unit]
Description=A KSM Server entry
After=network.target

[Service]
Environment="PATH=${path.join(__dirname, "../../../../../../bin/")}:$PATH"
ExecStart="${path.join(__dirname, "../../../../../../bin/ksm")}" start ${fid}
WorkingDirectory=/
Restart=always
User=${user}
Group=${group}
StandardOutput=file:/var/log/std-${fid}.log
StandardError=file:/var/log/err-${fid}.log

[Install]
WantedBy=multi-user.target`;

    api.configuration.writeService(fid, template);
    api.configuration.writeServerlist(serverlist);

    api.controller.enableService(fid);
    if (start) {
        api.controller.startService(fid);
    }

    return 0;
}