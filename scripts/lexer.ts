function lexer(code: string): string[] {
    return code
        .split(
            /\/\/[^\n]*|(\n|"[^"]*"|[a-zA-Z_][a-zA-Z_0-9]*|\n|\(|\)|;|[0-9]+\.[0-9]+| +|}|{)|\r/
        )
        .filter((v) => v);
}
export { lexer };
