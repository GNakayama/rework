// Libs
import Immutable from 'seamless-immutable';

import cloneDeep from 'lodash/cloneDeep';
import assignIn from 'lodash/assignIn';
// import unionBy from 'lodash/unionBy';

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
            const newItems = action.payload.items.items.map(item => Object.assign({ error, 'key': item.id }, item));
            // const allItems = unionBy(state.items, newItems, 'id');
            const allItems = newItems;

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
                    return assignIn(cloneDeep(item), cloneDeep(action.payload.item.item));
                }

                return item;
            });

            return Immutable.from(Object.assign({ ...state }, { 'items': updatedItems }));
        }
        case INSERT: {
            const newItems = action.payload.items.map(item => ({ ...item, error, 'key': item.id }));
            const allItems = Array.from(new Set([...state.items, ...newItems]));

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
