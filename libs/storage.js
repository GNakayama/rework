export default class Storage {
    static get(name, ret2 = null, isLocal = true) {
        const ret = isLocal ? window.localStorage.getItem(name)
            : window.sessionStorage.getItem(name);

        if (ret === null) {
            this.set(name, ret2);
        }

        return ret === null ? ret2 : ret;
    }

    static set(name, value, isLocal = true) {
        if (isLocal) {
            return window.localStorage.setItem(name, value);
        }

        return window.sessionStorage.setItem(name, value);
    }

    static delete(name, isLocal = true) {
        if (isLocal) {
            return window.localStorage.removeItem(name);
        }

        return window.sessionStorage.removeItem(name);
    }
}
