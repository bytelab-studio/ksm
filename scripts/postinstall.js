#!/usr/bin/env node
const os = require("os");
const fs = require("fs");
const path = require("path");
if (os.type() !== "Linux") {
    console.log("KMS is not running on a linux system so not all features can be provided");
    process.exit(0);
}

if (process.geteuid() !== 0) {
    console.log("KSM must be install with root privileges");
    process.exit(1);
}

const config_path = "/etc/ksm";
const config_content = JSON.stringify({
    env: {
        "KSM_CONFIG": "/etc/ksm/config.json",
        "KSM_SERVERLIST": "/etc/ksm/serverlist"
    }
}, null, 4);

try {
    if (fs.existsSync(path.join(config_path)) && fs.statSync(config_path).isDirectory()) {
        fs.rmdirSync(config_path, {recursive: true});
    }
    console.log("Write config")
    fs.mkdirSync(config_path, {recursive: true});
    fs.writeFileSync(path.join(config_path, "config.json"), config_content);
    fs.writeFileSync(path.join(config_path, "serverlist"), "[]");
} catch (e) {
    console.log("Failed to execute post-install script:\n" + e);
    process.exit(1);
}

process.exit(0);