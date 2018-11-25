
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'


import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



import { connect } from 'react-redux';
import * as reservaActions from '../actions/reserva'
import * as adminActions from '../actions/admin'



const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%'
    },
});

class Admin extends React.Component {
    state = {
        cod: '',
        loadingCod: false,
        startDate: null,
        endDate: null,
        focusedInput: null,
        clean: false,
        dataIntercalada: false,
        status: 'Pendente',
        name: 'hai',
        id_reserva: -1
    }

    componentDidMount() {
        this.props.loadReservas()
        this.props.loadDatasReservadas()
    }


    handleGerar = async () => {
        this.setState({ loadingCod: true })
        try {
            const cod = await axios.get('/geracodigo')
            this.setState({ cod: cod.data.retorno, loadingCod: false })
        }
        catch (error) {
            console.log(error)
            this.setState({ loadingCod: false })

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

    handleChange = (event, id) => {
        this.setState({ [event.target.name]: event.target.value, id_reserva: id });
        this.props.updateReserva(id, event.target.value)
    };


    render() {
        const { classes } = this.props;
        console.log(this.props.reservas)
        return (
            <React.Fragment>
                <CssBaseline />
                <div className={classes.root}>
                    <div style={{ backgroundColor: '#EAEEF2', flex: 1, padding: 20, marginTop: 5 }}>
                        <Paper style={{ flex: 1, padding: 20 }} elevation={1}>
                            <Typography variant="headline" component="h3">
                                Código de convite:
                            </Typography>
                            <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                <Button style={{ marginRight: 10 }} onClick={this.handleGerar} color="primary">Gerar:</Button>
                                {this.state.loadingCod
                                    ?
                                    <CircularProgress size={30} />
                                    :
                                    <Typography component="p">
                                        {this.state.cod}
                                    </Typography>
                                }
                            </div>
                        </Paper>
                        <div style={{ margin: 20 }} />
                        <Paper style={{ flex: 1, padding: 20 }} elevation={1}>
                            <Typography variant="headline" component="h3">
                                Bloquear datas:
                            </Typography>
                            <div style={{ marginTop: 10 }} />
                            <div>
                                <DateRangePicker
                                    minimumNights={0}
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
                                />
                                <Button style={{ marginRight: 10 }} color="primary">Bloquear</Button>
                            </div>
                        </Paper>
                        <div style={{ margin: 20 }} />
                        <Paper style={{ flex: 1, padding: 20 }} elevation={1}>
                            <Typography variant="headline" component="h3">
                                Reservas
                            </Typography>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Check-in</TableCell>
                                        <TableCell>Check-out</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.props.reservas.map((r, i) => <TableRow key={i}>
                                            <TableCell>{r[0]}</TableCell>
                                            <TableCell>{moment(r[1]).utc().format("DD/MM/YYYY")}</TableCell>
                                            <TableCell>{moment(r[2]).utc().format("DD/MM/YYYY")}</TableCell>
                                            <TableCell><Select
                                                style={{ minWidth: 150 }}
                                                value={(this.state.status && this.state.id_reserva === r[4]) ? this.state.status : r[3]}
                                                onChange={event => this.handleChange(event, r[4])}
                                                displayEmpty
                                                name="status"
                                            >
                                                <MenuItem value="Pendente">
                                                    <em>Pendente</em>
                                                </MenuItem>
                                                <MenuItem value="Aprovado">Aprovado</MenuItem>
                                                <MenuItem value="Cancelado">Cancelado</MenuItem>
                                                <MenuItem value="Bloqueado">Bloqueado</MenuItem>
                                            </Select></TableCell>
                                        </TableRow>)
                                    }

                                </TableBody>
                            </Table>

                        </Paper>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        datasReservadas: state.reserva.datasReservadas,
        datasReservadasLoading: state.reserva.datasReservadasLoading,
        reservas: state.admin.reservas
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        loadDatasReservadas: () => dispatch(reservaActions.datasReservadas()),
        loadReservas: () => dispatch(adminActions.getReservas()),
        updateReserva: (id_reserva, acao) => dispatch(adminActions.updateReserva(id_reserva, acao))
    }
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Admin));