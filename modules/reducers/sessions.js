import { LOGIN, LOGOUT, LOGIN_FAILED, RECOVERY_PASSWORD } from '../consts/sessions';

export function isLoggedIn(state = false, action) {
    switch (action.type) {
        case LOGIN:
            return true;
        case LOGOUT:
            return false;
        default:
            return state;
    }
}

export function loginFailed(state = false, action) {
    switch (action.type) {
        case LOGIN_FAILED:
            return action.payload.loginFailed;
        default:
            return state;
    }
}

export function passwordChanged(state = false, action) {
    switch (action.type) {
        case RECOVERY_PASSWORD:
            return action.payload.passwordChanged;
        default:
            return state;
    }
}
