import { err, defaultLang } from "./errors";
import * as log from "./print";
let lang = Intl.NumberFormat().resolvedOptions().locale;
function output(id: string) {
    if (id in err) {
        let temp;
        switch (err[id].type) {
            case "info":
                temp = err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.debug(temp[0].msg);
                } else {
                    log.debug(
                        err[id].msg.filter((v) => {
                            return v.lang == defaultLang;
                        })[0].msg
                    );
                }
                break;
            case "log":
                temp = err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.log(temp[0].msg);
                } else {
                    log.log(
                        err[id].msg.filter((v) => {
                            return v.lang == defaultLang;
                        })[0].msg
                    );
                }
                break;
            case "warn":
                temp = err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.warn(temp[0].msg);
                } else {
                    log.warn(
                        err[id].msg.filter((v) => {
                            return v.lang == defaultLang;
                        })[0].msg
                    );
                }
                break;
            case "error":
                temp = err[id].msg.filter((v) => {
                    return v.lang == lang;
                });
                if (temp.length > 0) {
                    log.error(temp[0].msg);
                } else {
                    log.error(
                        err[id].msg.filter((v) => {
                            return v.lang == defaultLang;
                        })[0].msg
                    );
                }
                break;
        }
    }
}
export { output };
