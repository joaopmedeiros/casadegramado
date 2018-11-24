import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import moment from 'moment'

import { connect } from 'react-redux';
import * as actions from '../actions/reserva'
import { DateRangePicker } from 'react-dates';

class Reservas extends React.Component {
    state = {
        startDate: null,
        endDate: null,
        focusedInput: null,
        clean: false,
        dataIntercalada: false
    }

    componentDidMount() {
        this.props.loadDatasReservadas()
        this.props.loadMinhasReservas(this.props.idUsuario)
    }

    confirmar = () => {
        const { startDate, endDate } = this.state
        if (this.state.startDate && this.state.endDate) {
            this.props.reservar(this.props.idUsuario, startDate.locale("en").utc().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"), endDate.locale("en").utc().format("ddd, DD MMM YYYY HH:mm:ss [GMT]"))
        }
    }

    dateChangeHandler = ({ startDate, endDate }) => {

        for (let i = moment(startDate); i.diff(endDate, 'days') <= 0; i.add(1, 'days')) {
            if (this.props.datasReservadas.has(i.format('L'))) {
                this.setState({ dataIntercalada: true })
                return
            }

        }

        this.setState({ startDate, endDate, dataIntercalada: false })

    }

    render() {
        console.log(this.props.minhasReservas)
        const { endDate, startDate } = this.state
        if (this.props.loading && !this.state.clean) this.setState({ clean: true })
        console.log(this.state.dataIntercalada)
        return (
            <div>
                <Typography variant="display2" style={{ fontSize: 30, color: '#1B5E20', opacity: 1, marginTop: 20, marginLeft: 20 }}>
                    Nova Reserva
                </Typography>
                <div style={{ marginLeft: 20, marginTop: 20, display: "inline-flex", flexDirection: 'row', border: '1px solid gray', borderRadius: 5, padding: 5, flex: 0 }}>
                    <div >
                        {this.props.datasReservadasLoading
                            ?
                            <CircularProgress />
                            :
                            <DateRangePicker
                                isDayBlocked={d => this.props.datasReservadas.has(d.format("DD/MM/YYYY"))}
                                disabled={this.state.loading}
                                noBorder={true}
                                startDatePlaceholderText="Data Inicial"
                                endDatePlaceholderText="Data Final"
                                showDefaultInputIcon
                                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                onDatesChange={this.dateChangeHandler} // PropTypes.func.isRequired,
                                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                            />}
                    </div>
                    <div style={{ color: '#1B5E20', alignSelf: 'center' }}>
                        {startDate && endDate ? "R$: " + (endDate.diff(startDate, 'd') * 1500).toString() + ",00" : ""}
                    </div>
                    <div style={{ alignSelf: 'center', marginLeft: 20 }}>
                        {this.props.loading
                            ? <CircularProgress />
                            : <Button
                                disabled={!(startDate && endDate) || this.state.dataIntercalada}
                                onClick={this.confirmar}
                                size="medium"
                                style={{ color: '#1B5E20' }} >
                                Confirmar
                              </Button>
                        }

                    </div>

                </div>
                {
                    this.state.dataIntercalada &&
                    <Typography style={{ color: '#cc0000', marginLeft: 20, marginTop: 10 }} component="p">
                        Data inválida. Já existem datas reservadas entre as datas que você solicitou.
                    </Typography>
                }

                <Typography variant="display2" style={{ fontSize: 30, color: '#1B5E20', opacity: 1, marginTop: 40, marginLeft: 20 }}>
                    Reservas anteriores
                </Typography>


                <div style={{ margin: 20, color: '#1B5E20', alignSelf: 'center' }}>
                    {
                        this.props.minhasReservas.length > 0
                            ?
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Check-in</TableCell>
                                            <TableCell>Check-out</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.minhasReservas.map(n => {
                                            return (
                                                <TableRow>
                                                    <TableCell>{n[0]}</TableCell>
                                                    <TableCell>{n[1]}</TableCell>
                                                    <TableCell>Aguardando</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Paper>
                            :
                            this.props.minhasReservasLoading
                                ?
                                <CircularProgress />
                                :
                                "Você ainda não tem reservas."
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.reserva.reservarLoading,
        error: state.reserva.reservarFail,
        idUsuario: state.usuario.id,
        datasReservadas: state.reserva.datasReservadas,
        datasReservadasLoading: state.reserva.datasReservadasLoading,
        minhasReservasLoading: state.reserva.minhasReservasLoading,
        minhasReservas: state.reserva.minhasReservas
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        reservar: (idUsuario, inicio, fim) => dispatch(actions.reservar(idUsuario, inicio, fim)),
        loadDatasReservadas: () => dispatch(actions.datasReservadas()),
        loadMinhasReservas: (idUsuario) => dispatch(actions.minhasReservas(idUsuario))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Reservas);