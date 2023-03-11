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
const util = __importStar(require("./util"));
const log = __importStar(require("./print"));
let reservedWord = [
    "func",
    "if",
    "else",
    "for",
    "while",
    "return",
    "break",
    "continue",
    "import",
    "from",
    "as",
    "class",
    "is",
    "not",
    "and",
    "or",
    "True",
    "False",
    "None",
    "try",
    "except",
    "raise",
    "finally",
    "assert",
    "yield",
    "with",
    "in",
    "int",
    "float",
    "str",
    "bool",
];
let types = ["int", "float", "str", "bool"];
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
    return { asts: astArray, option: option };
}
function $parser(tokens, option) {
    let tokenTemp = [...tokens];
    let backupToken = [...tokens];
    let count = 0;
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
        option: option,
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
            option: option,
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
                        for (let i = 0; i < arg.length; i += 3) {
                            if (arg[i + 1].match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                                if (reservedWord.includes(arg[i + 1])) {
                                    util.output("reservedWord");
                                }
                                else {
                                    if (types.includes(arg[i])) {
                                        args.push({
                                            type: arg[i],
                                            varName: arg[i + 1],
                                        });
                                    }
                                    else {
                                        util.output("typeError");
                                    }
                                    if (i + 2 < arg.length) {
                                        if (arg[i + 2] != ",") {
                                            log.error("Syntax Error:(" +
                                                (option.line + 1) +
                                                "," +
                                                (option.count + 1) +
                                                ")");
                                        }
                                    }
                                    else {
                                        break;
                                    }
                                }
                            }
                            else {
                                log.error("Syntax Error:(" +
                                    (option.line + 1) +
                                    "," +
                                    (option.count + 1) +
                                    ")");
                            }
                        }
                        let returnType = "";
                        if (getNext() == "->") {
                            returnType = getNext();
                            if (!types.includes(returnType)) {
                                util.output("typeError");
                            }
                        }
                        else {
                            returnBackupTokens();
                        }
                        getNext();
                        let parsedCode = $parser(tokenTemp, option);
                        astReturn.tokens = parsedCode.tokens;
                        setAst({
                            op: "func",
                            left: funcName,
                            right: {
                                args: args,
                                returnType: returnType,
                                ast: parsedCode.ast,
                            },
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
                saveTokens();
        }
    })
        .c("{", (value) => {
        let depth = 1;
        let token = [];
        let i = 1;
        for (; i < tokens.length; ++i) {
            if (tokens[i] == "{") {
                depth += 1;
            }
            else if (tokens[i] == "}") {
                depth -= 1;
                if (depth == 0) {
                    break;
                }
            }
            token.push(tokens[i]);
        }
        let $parsedBlock = blockParser(token, option);
        astReturn.option = $parsedBlock.option;
        astReturn.tokens = tokens.slice(i + 1);
        setAst({
            op: "system",
            left: "block",
            right: $parsedBlock.asts,
        });
    });
    if (astReturn.ast.op == "") {
        log.error("Syntax Error:(" +
            (option.line + 1) +
            "," +
            (option.count + 1) +
            ")");
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
        option = temp.option;
        option.count += temp.count;
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
