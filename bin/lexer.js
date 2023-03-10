"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexer = void 0;
function lexer(code) {
    return code
        .split(/\/\/[^\n]*|(\n|"[^"]*"|[a-zA-Z_][a-zA-Z_0-9]*|\n|\(|\)|;|[0-9]+\.[0-9]+| +|}|{)|\r/)
        .filter((v) => v);
}
exports.lexer = lexer;
