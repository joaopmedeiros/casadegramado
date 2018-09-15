import React from 'react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import titleImage from '../images/gesiel.jpg'
import './Gesiel/styles.css'
import Login from '../components/Login'
import Cadastro from '../components/Cadastro'

import FlashOn from '@material-ui/icons/FlashOn';
import Group from '@material-ui/icons/Group';


import { Typography } from '@material-ui/core';

import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

import ImgCasa from '../images/41.jpeg'
import Map from '../components/Map'

const photos = [
    { src: ImgCasa, width: 4, height: 3 },
    { src: 'https://i.imgur.com/xvQGqBs.jpg', width: 1.4, height: 1 },
    { src: 'https://source.unsplash.com/qDkso9nvCg0/600x799', width: 3, height: 4 },
    { src: 'https://source.unsplash.com/iecJiKe_RNg/600x799', width: 3, height: 4 },
    { src: 'https://source.unsplash.com/epcsn8Ed8kY/600x799', width: 3, height: 4 },
    { src: 'https://source.unsplash.com/NQSWvyVRIJk/800x599', width: 4, height: 3 },
];



export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            currentImage: 0,
            login: false,
            cadastro: false,
            lightboxIsOpen: false,
            email: '',
            assunto: '',
            nome: '',
            mensagem: ''
        };

        this.closeLightbox = this.closeLightbox.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    openLightbox(event, obj) {
        this.setState({
            currentImage: obj.index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }
    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }
    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }


    handleReservar = () => {
        this.setState({ login: true })
    }

    handleCloseLogin = () => {
        this.setState({ login: false })
    }

    handleLoginToCadastro = (e) => {
        e.preventDefault();
        this.setState({ login: false, cadastro: true })
    }

    handleCloseCadastro = () => {
        this.setState({ cadastro: false })
    }

    render() {
        return (
            <div>
                <Login
                    open={this.state.login}
                    handleClose={this.handleCloseLogin}
                    handleCadastro={this.handleLoginToCadastro} />

                <Cadastro
                    open={this.state.cadastro}
                    handleClose={this.handleCloseCadastro} />

                <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div className="title-text" style={{ fontFamily: 'Gilda Display' }} >Casa de Gramado</div>
                    <img className="title-image" src={titleImage} />
                    <Button
                        style={{ backgroundColor: "#729050", borderRadius: 35 }}
                        size="large"
                        className="title-button"
                        variant="raised"
                        color="primary"
                        onClick={this.handleReservar}>
                        RESERVAR
                    </Button>
                </div>

                <div style={{ padding: 30, backgroundColor: '#EAEEF2', marginTop: -5 }}>
                    <Grid container spacing={24}>
                        <Grid className="resource-unit" item xs={12} sm={4}>
                            <Paper elevation={1}>
                                <div style={{ padding: 20 }}>
                                    <FlashOn color="primary" style={{ fontSize: 50, color: '#729050' }} />
                                    <div style={{ marginTop: 10 }} />
                                    <Typography variant="title">
                                        Reserva Instântanea
                                    </Typography>
                                    <div style={{ marginTop: 20 }} />
                                    <Typography component="p">
                                        Reserve você mesmo aqui pelo site. Não precisa aguardar confirmação, se você recebeu oconvite do aitinha é só reservar.
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid className="resource-unit" item xs={12} sm={4}>
                            <Paper elevation={1}>
                                <div style={{ padding: 20 }}>
                                    <FlashOn color="primary" style={{ fontSize: 50, color: '#729050' }} />
                                    <div style={{ marginTop: 10 }} />
                                    <Typography variant="title">
                                        Reserva Instântanea
                                    </Typography>
                                    <div style={{ marginTop: 20 }} />
                                    <Typography component="p">
                                        Reserve você mesmo aqui pelo site. Não precisa aguardar confirmação, se você recebeu oconvite do aitinha é só reservar.
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid className="resource-unit" item xs={12} sm={4}>
                            <Paper elevation={1}>
                                <div style={{ padding: 20 }}>
                                    <FlashOn color="primary" style={{ fontSize: 50, color: '#729050' }} />
                                    <div style={{ marginTop: 10 }} />
                                    <Typography variant="title">
                                        Reserva Instântanea
                                    </Typography>
                                    <div style={{ marginTop: 20 }} />
                                    <Typography component="p">
                                        Reserve você mesmo aqui pelo site. Não precisa aguardar confirmação, se você recebeu oconvite do aitinha é só reservar.
                                    </Typography>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                <div style={{ paddingHorizontal: 50, textAlign: 'center', paddingTop: 50, paddingBottom: 50 }}>
                    <Typography variant="headline" style={{ fontFamily: 'Gilda Display' }}>
                        "Um espaço completo e seguro em condomínio fechado.
                    </Typography>
                    <Typography variant="headline" style={{ fontFamily: 'Gilda Display' }}>
                        Perfeito  você desfrutar ótimos momentos com sua família."
                    </Typography>
                </div>
                <Gallery photos={photos} onClick={this.openLightbox} />
                <Lightbox images={photos}
                    onClose={this.closeLightbox}
                    onClickPrev={this.gotoPrevious}
                    onClickNext={this.gotoNext}
                    currentImage={this.state.currentImage}
                    isOpen={this.state.lightboxIsOpen}
                />
                <div style={{ backgroundColor: '#EAEEF2' }}>

                    <div style={{ display: 'flex', flex: 1 }}>
                        <div style={{ flex: 1 }}>
                            <Map isMarkerShown />
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', marginTop: 10 }}>
                            <Typography variant="display2">
                                Contato
                            </Typography>
                            <div style={{ padding: 20 }}>
                                <TextField
                                    id="password-input"
                                    label="Nome"
                                    margin="dense"
                                    fullWidth
                                    onChange={this.handleChange('nome')}
                                />
                                <TextField
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    onChange={this.handleChange('email')}
                                />
                                <TextField
                                    label="Assunto"
                                    margin="dense"
                                    fullWidth
                                    onChange={this.handleChange('assunto')}
                                />
                                <TextField
                                    label="Mensagem"
                                    multiline
                                    margin="dense"
                                    fullWidth
                                    onChange={this.handleChange('mensagem')}
                                />
                                <div style={{marginTop: 20, marginBottom: 10}}>
                                <Button variant="raised" color="primary">
                                    Enviar
                              </Button>
                                </div>
                                
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}