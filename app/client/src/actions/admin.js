import axios from 'axios';
import * as types from './types'

export const getReservas = () => async dispatch => {
    try {
        const res = await axios.get('/getreservasadm')
        dispatch({
            type: types.GET_RESERVAS_ADM,
            payload: res.data.reservas.sort((a, b) => a[3].localeCompare(b[3]))
        })
    }
    catch (error) {
        console.log(error.response)
    }
}


export const updateReserva = (id_reserva, acao) => async dispatch => {
    try {
        console.log({ id_reserva, acao })
        const res = await axios.post('/atualizareserva', {
            id_reserva,
            acao
        })
        console.log(res)
        dispatch(getReservas())
    } catch (error) {
        console.log(error.response)
    }
}
