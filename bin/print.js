"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.log = exports.warn = exports.error = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let temp = fs.readFileSync(path.join(__dirname, "./logConfig.cfg"), "utf-8");
let logLevel = temp == "info" ? 0 : temp == "log" ? 1 : temp == "warn" ? 2 : 3;
function error(msg) {
    if (logLevel > 3)
        return;
    console.error("\x1b[031m%s\x1b[0m", msg);
    process.exit();
}
exports.error = error;
function warn(msg) {
    if (logLevel > 2)
        return;
    console.warn("\x1b[033m%s\x1b[0m", msg);
}
exports.warn = warn;
function log(msg) {
    if (logLevel > 1)
        return;
    console.log(msg);
}
exports.log = log;
function debug(msg) {
    if (logLevel > 0)
        return;
    console.info("\x1b[090m%s\x1b[0m", msg);
}
exports.debug = debug;
