import * as types from './types'
import axios from 'axios'

import moment from 'moment'

const datasReservadasStart = () => {
    return {
        type: types.DATAS_RESERVADAS_START
    }
}

const datasReservadasFail = (error) => {
    return {
        type: types.DATAS_RESERVADAS_FAIL,
        error,
    }
}

const datasReservadasSuccess = (datasReservadas) => {
    return {
        type: types.DATAS_RESERVADAS_SUCCESS,
        datasReservadas,
    }
}

export const reservar = (idUsuario, inicio, fim) => async dispatch => {
    dispatch({ type: types.RESERVAR_START })
    const data = { 'id_usuario': idUsuario, 'data_checkin': inicio, 'data_checkout': fim }

    try {
        const res = await axios.post('/reserva', data)
        dispatch(datasReservadas())
        dispatch(minhasReservas(idUsuario))
        dispatch({ type: types.RESERVAR_SUCCESS, idReserva: res.data.id_reserva });
    }
    catch (error) {
        dispatch({ type: types.RESERVAR_FAIL, error })
    }
}




export const datasReservadas = () => async dispatch => {
    try {
        dispatch(datasReservadasStart())
        const res = await axios.get('/datasreservadas')
        const datas = res.data.datas.map(d => moment(d).locale("en").utcOffset(0).format("DD/MM/YYYY"))
        dispatch(datasReservadasSuccess(datas))
    }
    catch (error) {
        dispatch(datasReservadasFail(error))
    }
}



const minhasReservasStart = () => {
    return {
        type: types.MINHAS_RESERVAS_START
    }
}

const minhasReservasFail = (error) => {
    return {
        type: types.MINHAS_RESERVAS_FAIL,
        error,
    }
}

const minhasReservasSuccess = (minhasReservas) => {
    return {
        type: types.MINHAS_RESERVAS_SUCCESS,
        minhasReservas,
    }
}


export const minhasReservas = (idUsuario) => async dispatch => {
    try {
        dispatch(minhasReservasStart())
        const reservas = await axios.post('/getreservas', { 'id_usuario': idUsuario })
        console.log(reservas)
        const datas = [...reservas.data.reservas[idUsuario].map(r => [moment(r[0]), moment(r[1]), r[2], r[3]])].sort((a, b) => b[0] - a[0])
        dispatch(minhasReservasSuccess(datas.map(d => [d[0].utc().format("DD/MM/YYYY"), d[1].utc().format("DD/MM/YYYY"), d[2], d[3]])))
    }
    catch (error) {
        dispatch(minhasReservasFail(error))
    }
}


export const updateReserva = (id_usuario, id_reserva, acao) => async dispatch => {
    try {
        console.log({ id_reserva, acao })
        const res = await axios.post('/atualizareserva', {
            id_reserva,
            acao
        })
        console.log(res)
        dispatch(minhasReservas(id_usuario))
    } catch (error) {
        console.log(error.response)
    }
}