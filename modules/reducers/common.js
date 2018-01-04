import { CHANGE_LANGUAGE, START_LOADING, STOP_LOADING } from '../consts/common';

export function isLoading(state = false, action) {
    switch (action.type) {
        case START_LOADING:
            return true;
        case STOP_LOADING:
            return false;
        default:
            return state;
    }
}

export function languageDict(state = {}, action) {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return action.payload.languageDict;
        default:
            return state;
    }
}

