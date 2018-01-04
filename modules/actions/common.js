// Consts
import { CHANGE_LANGUAGE, START_LOADING, STOP_LOADING } from '../consts/common';

// Actions
export function startRequest() {
    return {
        'type': START_LOADING
    };
}

export function stopRequest() {
    return {
        'type': STOP_LOADING
    };
}

export function changeLanguage(lang) {
    console.log(lang);
    return {
        'type': CHANGE_LANGUAGE,
        'payload': {
            'languageDict': {}
        }
    };
}
