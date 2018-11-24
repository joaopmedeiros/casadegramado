import axios from 'axios';

export const getReservas = () => async dispatch => {
    try {
        const res = await axios.get('/getreservasadm')
        const datas = res.data
        console.log(datas)
    }
    catch (error) {
        console.log(error)
    }
}
