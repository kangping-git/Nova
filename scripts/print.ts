import * as fs from "fs";
import * as path from "path";
let temp: string = fs.readFileSync(
    path.join(__dirname, "./logConfig.cfg"),
    "utf-8"
);
let logLevel: number =
    temp == "info" ? 0 : temp == "log" ? 1 : temp == "warn" ? 2 : 3;
function error(msg: any) {
    if (logLevel > 3) return;
    console.error("\x1b[031m%s\x1b[0m", msg);
    process.exit();
}
function warn(msg: any) {
    if (logLevel > 2) return;
    console.warn("\x1b[033m%s\x1b[0m", msg);
}
function log(msg: any) {
    if (logLevel > 1) return;
    console.log(msg);
}
function debug(msg: any) {
    if (logLevel > 0) return;
    console.info("\x1b[090m%s\x1b[0m", msg);
}
export { error, warn, log, debug };
