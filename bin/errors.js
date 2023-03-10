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
exports.defaultLang = exports.err = void 0;
const xml2js = __importStar(require("xml2js"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const log = __importStar(require("./print"));
let err = {};
exports.err = err;
let defaultLang = "en";
exports.defaultLang = defaultLang;
xml2js.parseString(fs.readFileSync(path.join(__dirname, "./strings.xml")), (r, rs) => {
    if ("data" in rs) {
        rs = rs.data;
        if ("config" in rs) {
            for (let x in rs.config) {
                for (let i in rs.config[x].cfg) {
                    if ("type" in rs.config[x].cfg[i]["$"]) {
                        if (rs.config[x].cfg[i]["$"].type == "defaultLang") {
                            exports.defaultLang = defaultLang = rs.config[x].cfg[i]._;
                        }
                    }
                }
            }
        }
        if ("strings" in rs) {
            for (let x in rs.strings) {
                for (let i in rs.strings[x]) {
                    for (let y in rs.strings[x][i]) {
                        if ("id" in rs.strings[x][i][y]["$"]) {
                            err[rs.strings[x][i][y]["$"].id] = {
                                type: i,
                                msg: rs.strings[x][i][y].msg.map((v) => {
                                    return {
                                        lang: v.$.lang,
                                        msg: v._,
                                    };
                                }),
                            };
                        }
                    }
                }
            }
        }
        else {
            log.error("strings.xml is invalid");
        }
    }
    else {
        log.error("strings.xml is invalid");
    }
});
