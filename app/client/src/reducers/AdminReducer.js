import * as types from '../actions/types';

const initialState = {
    datasReservadas: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_RESERVAS_ADM: return state;
        default: return state;
    }
}

export default reducer;