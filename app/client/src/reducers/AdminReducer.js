import * as types from '../actions/types';

const initialState = {
    reservas: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_RESERVAS_ADM:
            return { ...state, reservas: action.payload };
        default: return state;
    }
}

export default reducer;