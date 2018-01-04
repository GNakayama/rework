export default class Cookies {
    static get(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }

        return undefined;
    }

    static getCookie(name) {
        return this.get(name);
    }

    static set(name, value, datetime = undefined) {
        if (datetime) {
            document.cookie = `${name}=${value}; expires=${datetime}`;
        } else {
            document.cookie = `${name}=${value}`;
        }
    }

    static setCookie(name, value, datetime = undefined) {
        this.set(name, value, datetime);
    }

    static remove(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    }

    static deleteCookie(name) {
        this.remove(name);
    }
}
