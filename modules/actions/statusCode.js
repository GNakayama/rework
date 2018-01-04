// Consts
import { SERVER_FAILED, NO_RESPONSE, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } from '../consts/statusCode';

// Actions
export function serverFailed() {
    return {
        'type': SERVER_FAILED
    };
}

export function noResponse() {
    return {
        'type': NO_RESPONSE
    };
}

export function forbidden() {
    return {
        'type': FORBIDDEN
    };
}

export function unauthorized() {
    return {
        'type': UNAUTHORIZED
    };
}

export function notFound() {
    return {
        'type': NOT_FOUND
    };
}
