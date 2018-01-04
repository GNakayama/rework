// Libs
import Storage from '../../libs/storage';
import Cookies from '../../libs/cookies';


// Consts
import { MAIN_URL } from '~/config';

// Actions
import { serverFailed, noResponse, unauthorized, forbidden, notFound } from './statusCode';
import { startRequest, stopRequest } from './common';


// Actions
export function get(id, actionType, endpoint, local = false) {
    return function foo(dispatch) {
        dispatch(startRequest());

        if (local) {
            const storageItems = JSON.parse(Storage.get(endpoint, '{}'));
            let item = null;

            if (Array.isArray(storageItems)) {
                for (let i = 0; i < storageItems.length; i++) {
                    if (storageItems[i].id === id) {
                        item = storageItems[i];
                        break;
                    }
                }
            } else {
                item = storageItems;
            }

            dispatch(stopRequest());
            dispatch({
                'type': actionType,
                'payload': {
                    item
                }
            });

            return Promise.resolve();
        }

        return fetch(`${MAIN_URL}/${endpoint}\/${id}`, {
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session')
            }
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 200) {
                return response.json();
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 403) {
                dispatch(forbidden());
            } else if (response.status === 404) {
                dispatch(notFound());
            }

            return null;
        }).then(json => {
            dispatch({
                'type': actionType,
                'payload': {
                    'item': json.item
                }
            });
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(endpoint);
            console.log(id);
            console.log(reason);
        });
    };
}

export function getAll(page, limit, actionType, endpoint, local = false) {
    return function foo(dispatch) {
        dispatch(startRequest());

        if (local) {
            const storageItems = JSON.parse(Storage.get(endpoint, '[]'));
            const total = storageItems.length;
            const items = storageItems.slice(page * limit, (page + 1) * limit);

            dispatch(stopRequest());
            dispatch({
                'type': actionType,
                'payload': {
                    'items': {
                        page,
                        limit,
                        items,
                        total
                    }
                }
            });

            return Promise.resolve();
        }

        return fetch(`${MAIN_URL}/${endpoint}?page=${page}&limit=${limit}`, {
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session')
            }
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 200) {
                return response.json();
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 403) {
                dispatch(forbidden());
            } else if (response.status === 404) {
                dispatch(notFound());
            }

            return null;
        }).then(json => {
            dispatch({
                'type': actionType,
                'payload': {
                    'items': {
                        page,
                        limit,
                        'items': json.items,
                        'total': json.total
                    }
                }
            });
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(endpoint);
            console.log(reason);
        });
    };
}

export function remove(id, actionType, endpoint, local = false) {
    return function foo(dispatch) {
        if (local) {
            const storageItems = JSON.parse(Storage.get(endpoint, '[]'));

            Storage.set(endpoint, JSON.stringify(storageItems.filter(item => item.id !== id)));

            dispatch({
                'type': actionType,
                'payload': {
                    id
                }
            });

            return Promise.resolve();
        }

        return fetch(`${MAIN_URL}/${endpoint}\/${id}`, {
            'method': 'DELETE',
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 200) {
                dispatch({
                    'type': actionType,
                    'payload': {
                        id
                    }
                });
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 403) {
                dispatch(forbidden());
            } else if (response.status === 404) {
                dispatch(notFound());
            }
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(endpoint);
            console.log(reason);
        });
    };
}

export function update(item, actionType, endpoint, local = false, collection = true) {
    return function foo(dispatch) {
        if (local) {
            let storageItems = JSON.parse(Storage.get(endpoint, '[]'));

            if (collection) {
                storageItems = storageItems.map(element => {
                    if (element.id === item.id) {
                        return item;
                    }

                    return element;
                });
            } else {
                Object.assign(storageItems, item);
            }

            Storage.set(endpoint, JSON.stringify(storageItems));

            dispatch({
                'type': actionType,
                'payload': {
                    item
                }
            });

            return Promise.resolve();
        }

        return fetch(`${MAIN_URL}/${endpoint}\/${item.id}`, {
            'method': 'PUT',
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session'),
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(item)
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 200) {
                dispatch({
                    'type': actionType,
                    'payload': {
                        item
                    }
                });
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 403) {
                dispatch(forbidden());
            } else if (response.status === 404) {
                dispatch(notFound());
            }
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(endpoint);
            console.log(reason);
        });
    };
}

export function updateAll(items, actionType, endpoint, local = false) {
    return function foo(dispatch) {
        if (local) {
            let storageItems = JSON.parse(Storage.get(endpoint, '[]'));
            const updatedItems = {};

            items.forEach(item => {
                updatedItems[item.id] = item;
            });

            storageItems = storageItems.map(item => {
                if (updatedItems[item.id] !== undefined) {
                    return updatedItems[item.id];
                }

                return item;
            });

            Storage.set(endpoint, JSON.stringify(storageItems));
            dispatch({
                'type': actionType,
                'payload': {
                    items
                }
            });

            return Promise.resolve();
        }

        return fetch(`${MAIN_URL}/${endpoint}\/`, {
            'method': 'PUT',
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session'),
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(items)
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 200) {
                dispatch({
                    'type': actionType,
                    'payload': {
                        items
                    }
                });
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 403) {
                dispatch(forbidden());
            } else if (response.status === 404) {
                dispatch(notFound());
            }
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(endpoint);
            console.log(reason);
        });
    };
}

export function insert(items, actionType, endpoint, local = false) {
    return function foo(dispatch) {
        if (local) {
            const storageItems = JSON.parse(Storage.get(endpoint, '[]'));

            items.forEach(item => storageItems.push(Object.assign(item, { 'id': Math.random().toString(36).substring(5) })));
            Storage.set(endpoint, JSON.stringify(storageItems));

            dispatch({
                'type': actionType,
                'payload': {
                    items
                }
            });

            return Promise.resolve();
        }

        return fetch(`${MAIN_URL}/${endpoint}`, {
            'method': 'POST',
            'headers': {
                'X-Auth-Token': Cookies.getCookie('Session'),
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({ items })
        }).then(response => {
            dispatch(stopRequest());

            if (response.status === 201) {
                return response.json();
            } else if (response.status === 500) {
                dispatch(serverFailed());
            } else if (response.status === 401) {
                dispatch(unauthorized());
            } else if (response.status === 403) {
                dispatch(forbidden());
            } else if (response.status === 404) {
                dispatch(notFound());
            }

            return null;
        }).then(json => {
            const newItems = items.map((item, index) => Object.assign(item, { 'id': json.ids[index] }));

            dispatch({
                'type': actionType,
                'payload': {
                    'items': newItems
                }
            });
        }).catch(reason => {
            dispatch(stopRequest());
            dispatch(noResponse());
            console.log(endpoint);
            console.log(reason);
        });
    };
}
