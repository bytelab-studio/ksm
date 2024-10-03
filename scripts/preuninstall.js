#!/usr/bin/env node
const os = require("os");
const fs = require("fs");

if (os.type() !== "Linux") {
    console.log("KMS is not running on a linux system so not all features can be provided");
    process.exit(0);
}

if (process.geteuid() !== 0) {
    console.log("KSM must be uninstall with root privileges");
    process.exit(1);
}

const cron_file = "/etc/cron.d/ksm-livecycle";
const config_path = "/etc/ksm";

try {
    console.log("Remove data");
    fs.unlinkSync(cron_file);
    fs.rmdirSync(config_path, {recursive: true});
} catch (e) {
    console.log("Failed to execute pre-uninstall script:\n" + e);
    process.exit(1);
}

process.exit(0);
