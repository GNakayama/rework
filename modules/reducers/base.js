// Libs
import Immutable from 'seamless-immutable';

export default function items(
    state,
    action,
    error,
    RECEIVE = 'action1',
    REMOVE = 'action2',
    UPDATE = 'action3',
    INSERT = 'action4',
    RECEIVE_ONE = 'action5',
    UPDATE_ALL = 'action6') {
    switch (action.type) {
        case RECEIVE: {
            if (state.items.length > (action.payload.items.page) * (action.payload.items.limit)) {
                return state;
            }

            const newItems = action.payload.items.items.map(item => Object.assign({ error, 'key': item.id }, item));
            const allItems = Array.from(new Set([...state.items, ...newItems]));

            return Immutable.from({
                'total': action.payload.items.total,
                'page': action.payload.items.page,
                'limit': action.payload.items.limit,
                'items': allItems
            });
        }
        case REMOVE: {
            const filteredItems = state.items.filter(item => item.id !== action.payload.id);
            return Immutable.from(Object.assign({ ...state }, { 'items': filteredItems }));
        }
        case UPDATE: {
            if (state.page === undefined) {
                return Immutable.from(Object.assign({ ...state }, action.payload.item));
            }

            const updatedItems = state.items.map(item => {
                if (item.id === action.payload.item.id) {
                    return action.payload.item;
                }

                return item;
            });

            return Immutable.from(Object.assign({ ...state }, { 'items': updatedItems }));
        }
        case INSERT: {
            const item = action.payload.item;
            const newItem = { ...item, error, 'key': item.id };
            const allItems = Array.from(new Set([...state.items, ...[newItem]]));

            return Immutable.from(Object.assign({ ...state }, { 'items': allItems }));
        }
        case RECEIVE_ONE:
            return Immutable.from(action.payload.item);
        case UPDATE_ALL: {
            const payloadItems = action.payload.items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

            const updatedItems = state.items.map(item => {
                if (payloadItems[item.id] !== undefined) {
                    return payloadItems[item.id];
                }

                return item;
            });

            return Immutable.from(Object.assign({ ...state }, { 'items': updatedItems }));
        }
        default:
            return Immutable.isImmutable(state) ? state : Immutable.from(state);
    }
}
