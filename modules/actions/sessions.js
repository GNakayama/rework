// Consts
import { LOGOUT, LOGIN, LOGIN_FAILED, RECOVERY_PASSWORD } from '../consts/sessions';
import { MAIN_URL } from '~/config';

// Actions
import { serverFailed, noResponse, unauthorized } from '~/framework/modules/actions/statusCode';
import { startRequest, stopRequest } from '~/framework/modules/actions/common';

// Libs
import Cookies from '../../libs/cookies';


function confirmLogout() {
    return {
        'type': LOGOUT,
        'payload': {
            'isLoggedIn': false
        }
    };
}

export function logout(local = false) {
    return function foo(dispatch) {
        dispatch(startRequest());

        if (local) {
            Cookies.remove('Session');
            Cookies.remove('user');
            dispatch(confirmLogout());
            return Promise.new();
        }

        return fetch(`${MAIN_URL}/logout`, {
            'method': 'POST',
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session')
            }
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 204) {
                Cookies.remove('Session');
                Cookies.remove('user');
                dispatch(confirmLogout());
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else {
                dispatch(noResponse());
            }
        });
    };
}

export function receiveToken(token) {
    Cookies.setCookie('Session', token);

    return {
        'type': LOGIN,
        'payload': {
            'isLoggedIn': true
        }
    };
}

function loginFailed() {
    return {
        'type': LOGIN_FAILED,
        'payload': {
            'loginFailed': true
        }
    };
}

export function login(credentials) {
    return function (dispatch) {
        dispatch(startRequest());

        return fetch(`${MAIN_URL}\/login`, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(credentials)
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 401) {
                dispatch(loginFailed());
            } else if (response.status === 200) {
                dispatch(receiveToken(response.headers.get('X-Auth-Token')));
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else {
                dispatch(noResponse());
            }
        });
    };
}

export function recoverPassword(password, token) {
    return function (dispatch) {
        dispatch(startRequest());

        return fetch(`${MAIN_URL}/recovery/${token}`, {
            'method': 'PUT',
            'headers': {
                'X-Auth-Token': '',
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({ password })
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 200) {
                dispatch({
                    'type': RECOVERY_PASSWORD,
                    'payload': {
                        'passwordChanged': true
                    }
                });
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 500) {
                dispatch(serverFailed());
            }
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(reason);
        });
    };
}
