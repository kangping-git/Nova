import * as lexer from "./lexer";
import * as parser from "./parser";
import * as util from "./util";
import * as fs from "fs";
import * as log from "./print";
import * as path from "path";

let args: string[] = process.argv.slice(2);

if (args.length == 0) {
    util.output("welcome");
} else {
    switch (args[0]) {
        case "run":
            if (args.length >= 2) {
                fs.stat(path.join(process.cwd(), args[1]), (err, stat) => {
                    if (err) {
                        util.output("commandNoFile");
                    } else if (!stat.isFile()) {
                        util.output("commandNoFile");
                    } else {
                        const fileData: string = fs.readFileSync(
                            path.join(process.cwd(), args[1]),
                            "utf-8"
                        );
                        const token: string[] = lexer.lexer(fileData);
                        const astArray = parser.parser(token);
                        if (args.includes("--SaveCompiledFile")) {
                            if (args.includes("--debug")) {
                                fs.writeFileSync(
                                    path.join(process.cwd(), args[1] + ".json"),
                                    JSON.stringify(astArray, null, "    ")
                                );
                            } else {
                                fs.writeFileSync(
                                    path.join(
                                        process.cwd(),
                                        args[1] + ".novac"
                                    ),
                                    JSON.stringify(astArray)
                                );
                            }
                        }
                    }
                });
            } else {
                util.output("commandErr");
            }
            break;
        default:
            util.output("commandErr");
    }
}
