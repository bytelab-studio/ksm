#!/usr/bin/env node
import * as api from "../api";
import {logger} from "../logger";

import * as child_process from "child_process";


process.on("exit", () => {
    child_process.spawn("ksm-cycle", {
        detached: true
    });
});


const config: api.Config = api.configuration.readConfig();
const serverlist: api.Serverlist = api.configuration.readServerlist();

if (process.argv.includes("--boot")) {
    for (const serverEntry of serverlist) {
        try {
            const serverConfig: api.ServerConfig = api.configuration.readServerConfig(serverEntry.path);
            serverEntry.pid = api.controller.spawnServer(serverEntry.path, serverConfig, config);
        } catch (e) {
            logger.error(`Failed to start server: '${serverEntry.path}': ${e}`);
        }
    }
}

api.configuration.writeServerlist(serverlist);

function isProcessingRunning(pid: number): boolean {
    try {
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
}

function checkCycle(): void {
    let requiresWrite: boolean = false;
    for (const serverEntry of serverlist) {
        logger.log(`Check server '${serverEntry.path}' is running`);
        if (!isProcessingRunning(serverEntry.pid)) {
            try {
                const serverConfig: api.ServerConfig = api.configuration.readServerConfig(serverEntry.path);
                serverEntry.pid = api.controller.spawnServer(serverEntry.path, serverConfig, config);
                requiresWrite = true;
            } catch (e) {
                logger.error(`Failed to start server: '${serverEntry.path}': ${e}`);
            }
        }
    }
    if (requiresWrite) {
        api.configuration.writeServerlist(serverlist);
    }
}

setInterval(() => checkCycle(), 60000); // 1min


