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
exports.output = void 0;
const errors_1 = require("./errors");
const log = __importStar(require("./print"));
let lang = Intl.NumberFormat().resolvedOptions().locale;
function output(id) {
    if (id in errors_1.err) {
        let temp;
        switch (errors_1.err[id].type) {
            case "info":
                temp = errors_1.err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.debug(temp[0].msg);
                }
                else {
                    log.debug(errors_1.err[id].msg.filter((v) => {
                        return v.lang == errors_1.defaultLang;
                    })[0].msg);
                }
                break;
            case "log":
                temp = errors_1.err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.log(temp[0].msg);
                }
                else {
                    log.log(errors_1.err[id].msg.filter((v) => {
                        return v.lang == errors_1.defaultLang;
                    })[0].msg);
                }
                break;
            case "warn":
                temp = errors_1.err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.warn(temp[0].msg);
                }
                else {
                    log.warn(errors_1.err[id].msg.filter((v) => {
                        return v.lang == errors_1.defaultLang;
                    })[0].msg);
                }
                break;
            case "error":
                temp = errors_1.err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.error(temp[0].msg);
                }
                else {
                    log.error(errors_1.err[id].msg.filter((v) => {
                        return v.lang == errors_1.defaultLang;
                    })[0].msg);
                }
                break;
        }
    }
}
exports.output = output;
