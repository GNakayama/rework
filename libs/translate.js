export default class Translate {
    constructor(dict) {
        this.dict = dict;
    }

    translate(text) {
        if (text in this.dict) {
            return this.dict[text];
        }

        console.warn(`Warn: Text ${text} has no defined translation!`);

        return text;
    }

    setDict(dict) {
        this.dict = dict;
    }
}
