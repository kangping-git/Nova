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
const lexer = __importStar(require("./lexer"));
const parser = __importStar(require("./parser"));
const util = __importStar(require("./util"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let args = process.argv.slice(2);
if (args.length == 0) {
    util.output("welcome");
}
else {
    switch (args[0]) {
        case "run":
            if (args.length >= 2) {
                fs.stat(path.join(process.cwd(), args[1]), (err, stat) => {
                    if (err) {
                        util.output("commandNoFile");
                    }
                    else if (!stat.isFile()) {
                        util.output("commandNoFile");
                    }
                    else {
                        const fileData = fs.readFileSync(path.join(process.cwd(), args[1]), "utf-8");
                        const token = lexer.lexer(fileData);
                        const astArray = parser.parser(token);
                        if (args.includes("--SaveCompiledFile")) {
                            if (args.includes("--debug")) {
                                fs.writeFileSync(path.join(process.cwd(), args[1] + ".json"), JSON.stringify(astArray, null, "    "));
                            }
                            else {
                                fs.writeFileSync(path.join(process.cwd(), args[1] + ".novac"), JSON.stringify(astArray));
                            }
                        }
                    }
                });
            }
            else {
                util.output("commandErr");
            }
            break;
        default:
            util.output("commandErr");
    }
}
