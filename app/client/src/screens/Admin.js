
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import axios from 'axios'



const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
        position: 'fixed',
        width: '100%',
        height: '100%'
    },
});

class Admin extends React.Component {
    state = {
        cod: '',
        loadingCod: false
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


    render() {
        const { classes } = this.props;
        //
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
                                <Button style={{marginRight: 10}} onClick={this.handleGerar} color="primary">Gerar:</Button>
                                {this.state.loadingCod
                                    ?
                                    <CircularProgress size={30}/>
                                    :
                                    <Typography component="p">
                                        {this.state.cod}
                                    </Typography>
                                }
                            </div>
                        </Paper>
                        <div style={{margin: 20}}/>
                        <Paper style={{ flex: 1, padding: 20 }} elevation={1}>
                            <Typography variant="headline" component="h3">
                                Bloquear datas:
                            </Typography>
                            
                        </Paper>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Admin);