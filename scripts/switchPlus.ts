class s {
    checkText: string = "";
    checked: boolean = false;
    constructor(text: string) {
        this.checkText = text;
        this.checked = false;
    }
    c(check: string | RegExp | Array<string> | any, callBack: Function) {
        if (!this.checked) {
            if (typeof check == "string") {
                if (this.checkText == check) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            } else if (check instanceof RegExp) {
                if (this.checkText.match(check)) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            } else if (check instanceof Array) {
                if (check.includes(this.checkText)) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            } else {
                if (this.checkText == check) {
                    callBack(this.checkText);
                    this.checked = true;
                }
            }
        }
        return this;
    }
    d(callBack: Function) {
        if (!this.checked) {
            callBack(this.checkText);
        }
        return this;
    }
}
export { s };
