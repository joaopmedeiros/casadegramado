import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import Home from './screens/Home';
import Admin from './screens/Admin'
import Reservas from './screens/Reservas'

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import 'moment/locale/pt-br';


import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from './components/AppBar'

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Montserrat'
    }
});


class App extends Component {
    render() {
        console.log(this.props.isAdmin)
        let routes = (
            <Switch>
                <Route path="/" exact component={Home} />
                <Redirect to="/" />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/reservas" component={Reservas} />
                    <Route path="/" exact component={Home} />
                    <Redirect to="/" />
                </Switch>
            );
        }

        if (this.props.isAdmin) {
            routes = (
                <Switch>
                    <Route path="/reservas" component={Admin} />
                    <Route path="/" exact component={Home} />
                    <Redirect to="/" />
                </Switch>
            );
        }


        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <div>
                        {this.props.isAuthenticated && <AppBar isAdmin={this.props.isAdmin}/>}
                        {routes}
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: Boolean(state.usuario.id),
        isAdmin: Boolean(state.usuario.adm)
    }
}



export default withRouter(connect(mapStateToProps)(App));