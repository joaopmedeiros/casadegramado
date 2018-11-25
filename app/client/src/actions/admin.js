import axios from 'axios';
import * as types from './types'

export const getReservas = () => async dispatch => {
    try {
        const res = await axios.get('/getreservasadm')
        dispatch({
            type: types.GET_RESERVAS_ADM,
            payload: res.data.reservas
        })
    }
    catch (error) {
        console.log(error.response)
    }
}
