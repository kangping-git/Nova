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
exports.parser = void 0;
const switchPlus_1 = require("./switchPlus");
const log = __importStar(require("./print"));
function blockParser(tokens, option) {
    let astArray = [];
    while (tokens.length > 0) {
        let temp = $parser(tokens, option);
        tokens = temp.tokens;
        option.count = temp.count;
        switch (temp.ast.op) {
            case "system":
                switch (temp.ast.left) {
                    case "line":
                        option.line += 1;
                        option.count = 0;
                        break;
                    case "None":
                        continue;
                }
        }
        astArray.push(temp.ast);
    }
    return astArray;
}
function $parser(tokens, option) {
    let tokenTemp = [...tokens];
    let backupToken = [...tokens];
    let count = option.count;
    function backupTokens() {
        backupToken = [...tokenTemp];
    }
    function returnBackupTokens() {
        tokenTemp = [...backupToken];
    }
    function getNext() {
        count += tokenTemp[0].length;
        tokenTemp = tokenTemp.slice(1);
        let index = tokenTemp.findIndex((v) => v[0] != " ");
        tokenTemp = tokenTemp.slice(index);
        count += tokenTemp.slice(1, index).join("").length;
        astReturn.count = count;
        return tokenTemp[0];
    }
    function getNext2() {
        count += tokenTemp[0].length;
        let index = tokenTemp.findIndex((v) => v[0] != " ");
        tokenTemp = tokenTemp.slice(index);
        count += tokenTemp.slice(1, index).join("").length;
        astReturn.count = count;
        return tokenTemp[0];
    }
    function saveTokens() {
        astReturn.tokens = [...tokenTemp];
    }
    function setAst(ast) {
        astReturn.ast = ast;
    }
    let astReturn = {
        ast: {
            left: "",
            op: "",
            right: "",
        },
        tokens: tokens.slice(1),
        count: count,
    };
    let next = getNext2();
    if (next == undefined) {
        return {
            ast: {
                left: "None",
                op: "system",
                right: "",
            },
            tokens: tokens.slice(1),
            count: count,
        };
    }
    new switchPlus_1.s(next)
        .c("\n", (value) => {
        astReturn.ast.op = "system";
        astReturn.ast.left = "line";
    })
        .c(/^[a-zA-Z_][a-zA-Z0-9_]*$/, (value) => {
        switch (value) {
            case "func":
                backupTokens();
                let funcName = getNext();
                if (funcName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                    backupTokens();
                    if (getNext() == "(") {
                        let arg = [];
                        let n = 1;
                        while (n > 0) {
                            let next = getNext();
                            if (next == "(") {
                                ++n;
                            }
                            else if (next == ")") {
                                --n;
                                if (n == 0) {
                                    break;
                                }
                            }
                            arg.push(next);
                        }
                        backupTokens();
                        let args = [];
                        for (let i in arg) {
                        }
                        let parsedCode = $parser(tokenTemp, option);
                        setAst({
                            op: "func",
                            left: funcName,
                            right: "",
                        });
                    }
                }
                break;
            default:
                setAst({
                    op: "test",
                    left: "a",
                    right: "",
                });
        }
    })
        .c("{", (value) => { });
    if (astReturn.ast.op == "") {
        log.error("Syntax Error:(lineAt:" + (option.line + 1) + ")");
    }
    return astReturn;
}
function parser(tokens) {
    let option = {
        line: 0,
        count: 0,
    };
    let astArray = [];
    while (tokens.length > 0) {
        let temp = $parser(tokens, option);
        tokens = temp.tokens;
        option.count = temp.count;
        switch (temp.ast.op) {
            case "system":
                switch (temp.ast.left) {
                    case "line":
                        option.line += 1;
                        option.count = 0;
                        break;
                    case "None":
                        continue;
                }
        }
        astArray.push(temp.ast);
    }
    return astArray;
}
exports.parser = parser;
