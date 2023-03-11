import { s } from "./switchPlus";
import * as util from "./util";
import * as log from "./print";

interface obj {
    [key: string]: any;
}

interface ast {
    left: string;
    op: string;
    right: any;
}

interface $parserReturn {
    tokens: string[];
    ast: ast;
    count: number;
    option: option;
}

interface blockParserReturn {
    asts: ast[];
    option: option;
}

interface option {
    line: number;
    count: number;
}

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
];

function blockParser(tokens: string[], option: option): blockParserReturn {
    let astArray: ast[] = [];
    while (tokens.length > 0) {
        let temp: $parserReturn = $parser(tokens, option);
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

function $parser(tokens: string[], option: option): $parserReturn {
    let tokenTemp: string[] = [...tokens];
    let backupToken: string[] = [...tokens];
    let count: number = 0;

    function backupTokens() {
        backupToken = [...tokenTemp];
    }

    function returnBackupTokens() {
        tokenTemp = [...backupToken];
    }

    function getNext() {
        count += tokenTemp[0].length;
        tokenTemp = tokenTemp.slice(1);
        let index: number = tokenTemp.findIndex((v) => v[0] != " ");
        tokenTemp = tokenTemp.slice(index);
        count += tokenTemp.slice(1, index).join("").length;
        astReturn.count = count;
        return tokenTemp[0];
    }

    function getNext2() {
        count += tokenTemp[0].length;
        let index: number = tokenTemp.findIndex((v) => v[0] != " ");
        tokenTemp = tokenTemp.slice(index);
        count += tokenTemp.slice(1, index).join("").length;
        astReturn.count = count;
        return tokenTemp[0];
    }

    function saveTokens() {
        astReturn.tokens = [...tokenTemp];
    }

    function setAst(ast: ast) {
        astReturn.ast = ast;
    }

    let astReturn: $parserReturn = {
        ast: {
            left: "",
            op: "",
            right: "",
        },
        tokens: tokens.slice(1),
        count: count,
        option: option,
    };

    let next: string = getNext2();

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

    new s(next)
        .c("\n", (value: string) => {
            astReturn.ast.op = "system";
            astReturn.ast.left = "line";
        })
        .c(/^[a-zA-Z_][a-zA-Z0-9_]*$/, (value: string) => {
            switch (value) {
                case "func":
                    // MEMO 関数だよ
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
                                } else if (next == ")") {
                                    --n;
                                    if (n == 0) {
                                        break;
                                    }
                                }
                                arg.push(next);
                            }

                            getNext();

                            backupTokens();

                            let args: obj[] = [];

                            for (let i = 0; i < arg.length; i += 4) {
                                if (arg[i].match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                                    if (reservedWord.includes(arg[i])) {
                                        util.output("reservedWord");
                                    } else {
                                    }
                                }
                            }

                            let parsedCode: $parserReturn = $parser(
                                tokenTemp,
                                option
                            );

                            astReturn.tokens = parsedCode.tokens;

                            setAst({
                                op: "func",
                                left: funcName,
                                right: parsedCode.ast,
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
        .c("{", (value: string) => {
            let depth = 1;
            let token: string[] = [];
            let i: number = 1;
            for (; i < tokens.length; ++i) {
                if (tokens[i] == "{") {
                    depth += 1;
                } else if (tokens[i] == "}") {
                    depth -= 1;
                    if (depth == 0) {
                        break;
                    }
                }
                token.push(tokens[i]);
            }
            let $parsedBlock: blockParserReturn = blockParser(token, option);
            astReturn.option = $parsedBlock.option;
            astReturn.tokens = tokens.slice(i + 1);
            setAst({
                op: "system",
                left: "block",
                right: $parsedBlock.asts,
            });
        });
    if (astReturn.ast.op == "") {
        log.error(
            "Syntax Error:(" +
                (option.line + 1) +
                "," +
                (option.count + 1) +
                ")"
        );
    }
    return astReturn;
}

function parser(tokens: string[]): ast[] {
    let option: option = {
        line: 0,
        count: 0,
    };
    let astArray: ast[] = [];
    while (tokens.length > 0) {
        let temp: $parserReturn = $parser(tokens, option);
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

export { parser };
