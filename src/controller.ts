import {logger} from "./logger";
import {Config, ServerConfig, Serverlist} from "./api";
import {handleException} from "./utils";

import path from "path";
import child_process from "child_process";


export namespace controller {
    export function serverExistInConfig(configFile: string, serverlist: Serverlist): boolean {
        for (const server of serverlist) {
            if (server.path == configFile) {
                return true;
            }
        }

        return false;
    }

    export function spawnServer(serverFile: string, serverConfig: ServerConfig, config: Config): number {
        const cwd: string = path.join(path.dirname(serverFile), serverConfig.cwd);
        const env: Record<string, string> = {};
        for (const key in config.env) {
            env[key] = config.env[key].toString();
        }
        for (const key in serverConfig.env) {
            env[key] = serverConfig.env[key].toString();
        }
        env["HTTP_PORT"] = serverConfig.ports.http.toString();
        env["HTTPS_PORT"] = serverConfig.ports.https.toString();

        const args: string[] = serverConfig.command.slice();
        const command: string = args.shift()!;
        try {
            logger.log(`Try to spawn server: '${serverFile}'`);
            const child: child_process.SpawnSyncReturns<Buffer> = child_process.spawnSync(command, args, {
                shell: true,
                cwd: cwd,
                env: env,
                stdio: "inherit",
            });
            return child.status!;
        } catch (e) {
            logger.error("Failed to spawn server: " + e);
            handleException(e);
        }
    }

    export function enableService(fid: string): void {
        child_process.execSync("systemctl daemon-reload");
        child_process.execSync(`systemctl enable ${fid}`);
    }

    export function startService(fid: string): void {
        child_process.execSync(`systemctl start ${fid}`);
    }

    export function restartService(fid: string): void {
        child_process.execSync(`systemctl restart ${fid}`);
    }

    export function stopService(fid: string): void {
        child_process.execSync(`systemctl stop ${fid}`);
    }
}