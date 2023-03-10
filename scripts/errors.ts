import * as xml2js from "xml2js";
import * as fs from "fs";
import * as path from "path";
import * as log from "./print";

interface obj {
    [key: string]: {
        type: "info" | "log" | "error" | "warn";
        msg: {
            lang: string;
            msg: string;
        }[];
    };
}
interface obj2 {
    [key: string]: any;
}

let err: obj = {};
let defaultLang: string = "en";
xml2js.parseString(
    fs.readFileSync(path.join(__dirname, "./strings.xml")),
    (r, rs) => {
        if ("data" in rs) {
            rs = rs.data;
            if ("config" in rs) {
                for (let x in rs.config) {
                    for (let i in rs.config[x].cfg) {
                        if ("type" in rs.config[x].cfg[i]["$"]) {
                            if (
                                rs.config[x].cfg[i]["$"].type == "defaultLang"
                            ) {
                                defaultLang = rs.config[x].cfg[i]._;
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
                                    type: i as
                                        | "info"
                                        | "log"
                                        | "error"
                                        | "warn",
                                    msg: rs.strings[x][i][y].msg.map(
                                        (v: obj2) => {
                                            return {
                                                lang: v.$.lang,
                                                msg: v._,
                                            };
                                        }
                                    ),
                                };
                            }
                        }
                    }
                }
            } else {
                log.error("strings.xml is invalid");
            }
        } else {
            log.error("strings.xml is invalid");
        }
    }
);
export { err, defaultLang };
