"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s = void 0;
class s {
    constructor(text) {
        this.checkText = "";
        this.checked = false;
        this.checkText = text;
        this.checked = false;
    }
    c(check, callBack) {
        if (!this.checked) {
            if (typeof check == "string") {
                if (this.checkText == check) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            }
            else if (check instanceof RegExp) {
                if (this.checkText.match(check)) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            }
            else if (check instanceof Array) {
                if (check.includes(this.checkText)) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            }
            else {
                if (this.checkText == check) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            }
        }
        return this;
    }
    d(callBack) {
        if (!this.checked) {
            callBack(this.checkText);
        }
        return this;
    }
}
exports.s = s;
