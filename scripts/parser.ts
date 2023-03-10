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
}

interface option {
    line: number;
    count: number;
}

function blockParser(tokens: string[], option: option) {
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
    return astArray;
}

function $parser(tokens: string[], option: option): $parserReturn {
    let tokenTemp: string[] = [...tokens];
    let backupToken: string[] = [...tokens];
    let count: number = option.count;

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

                            backupTokens();

                            let args: obj[] = [];

                            for (let i in arg) {
                            }

                            let parsedCode: $parserReturn = $parser(
                                tokenTemp,
                                option
                            );

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
        .c("{", (value: string) => {});
    if (astReturn.ast.op == "") {
        log.error("Syntax Error:(lineAt:" + (option.line + 1) + ")");
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

export { parser };
