import * as types from './types'
import axios from 'axios'


export const cadastro = (usuario) => async dispatch => {
    usuario = { ...usuario, telefone: usuario.telefone.replace(/[(\s)]/g, '') }
    dispatch({ type: types.CADASTRO_START });
    try {
        const res = await axios.post('/cadastra', usuario)
        dispatch({ type: types.CADASTRO_SUCCESS, id: res.data.id_usuario, adm: res.data.adm })
    }
    catch (error) {
        dispatch({ type: types.CADASTRO_FAIL, error })
    }
}


export const login = (email, senha) => async dispatch => {
    dispatch({ type: types.LOGIN_START })
    try {
        const res = await axios.post('/login', { email, senha })

        dispatch({
            type: types.LOGIN_SUCCESS,
            id: res.data.id_usuario,
            adm: res.data.adm
        });
    }
    catch (error) {
        dispatch({ type: types.LOGIN_FAIL, error})
    }
}

export const logout = () => async dispatch => {
    try {
        dispatch({ type: types.LOGOUT })
        await axios.post('/logout')
    }
    catch (error) {
        console.log("erro no logout: " + error)
    }

}




