from app import app,db, lm
from flask import render_template, flash
from app.models.forms import LoginForm
from app.models.tables import Usuario, Reservas
from app.models.tables import Codigos
from flask import request
from flask import jsonify
from datetime import datetime
from datetime import timedelta
from collections import defaultdict as dt
import random
from flask_login import login_user, logout_user, login_fresh, login_required, current_user


@lm.user_loader
def load_user(id):
    return Usuario.query.filter_by(id=id).first()


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template('index.html')

@app.route("/aitinha")
def index2():
    if login_fresh():
        return render_template('logado.html')
    return render_template('index2.html')


@app.route("/logado")
def logado():
    return render_template('logado.html')


@app.route("/gerador")
def gerador():
    if login_fresh():
        return render_template('gerador.html')
    else:
        return index2()


@app.route("/estalogado", methods=["GET"])
def estalogado():
    if login_fresh():
        return jsonify({'retorno': 'usuario logado', 'id_usuario': current_user.id}), 200
    else:
        return jsonify({'retorno': 'usuario nao logado, ou sessao expirada'}), 422


@app.route('/login_aitinha', methods=['POST'])
def do_admin_login():
    email = request.form['email']
    senha = request.form['senha']
    usuario = Usuario.query.filter_by(email=email).first()
    if usuario and usuario.adm and usuario.password == senha:
        login_user(usuario)
        return logado()
    else:
        return 'senha incorreta'


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get('email')
    senha = request.json.get('senha')
    usuario = Usuario.query.filter_by(email=email).first()
    if usuario and usuario.password == senha:
        login_user(usuario)
        id_usuario = usuario.id
        return jsonify({'retorno': 'usuario logado', 'id_usuario': id_usuario, 'adm': str(current_user.adm)}), 200
    else:
        return jsonify({'retorno': 'usuario ou senha invalidos'}), 422


@app.route("/getusuario", methods=["POST"])
@login_required
def getusuario():
    id_usuario = request.json.get('id_usuario')
    usuario = Usuario.query.filter_by(id=id_usuario).first()
    nome = usuario.nome
    email = usuario.email
    telefone = usuario.celular
    if usuario:
        return jsonify({'retorno': 'ok', 'nome': nome, 'email': email, 'telefone': telefone})
    else:
        return jsonify({'retorno': 'id incorreto'}), 422


@app.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({'retorno': 'usuario deslogado'}), 200
    

@app.route("/logout_aitinha", methods=["POST"])
def logout_aitinha():
    logout_user()
    return index2()


@app.route("/geracodigo", methods=["GET"])
@login_required
def geraCodigo():
    if current_user.adm:
        codigosExistentes = [x.codigo for x in Codigos.query.all()]
        algarismos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V','W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        while(True):
            codigo = ''.join([algarismos[random.randint(0, len(algarismos) - 1)] for x in range(6)])
            if codigo not in codigosExistentes:
                break
        novoCodigo = Codigos(codigo)
        db.session.add(novoCodigo)
        db.session.commit()
        return jsonify({'retorno' : str(codigo)}), 200
    else:
        return jsonify({'retorno' : "Voce nao tem as credenciais necessarias"}), 422


@app.route("/cadastra",methods=["POST"])
def teste():
    email = request.json.get('email')
    senha = request.json.get('senha')
    nome = request.json.get('nome')
    telefone = request.json.get('telefone')
    codigo = request.json.get('codigo')
    if codigo in [x.codigo for x in Codigos.query.all()]:
        novo_usuario = Usuario(email,senha,nome,telefone)
        codigo_usado = Codigos.query.filter_by(codigo=codigo).first()
        db.session.add(novo_usuario)
        db.session.delete(codigo_usado)
        db.session.commit()
        id_usuario = novo_usuario.id
        return jsonify({ 'retorno': 'ok', 'id_usuario': id_usuario }), 201
    else:
        return jsonify({ 'retorno': 'codigo incorreto' }), 422


@app.route("/reserva", methods=["POST"])
@login_required
def reserva():    
    DIARIA = 1500
    data_checkin = request.json.get('data_checkin')
    data_checkout = request.json.get('data_checkout')
    id_usuario = request.json.get('id_usuario')
    # valor = request.json.get('valor')    
    # desconto = request.json.get('desconto')
    # valor_final = request.json.get('valor_final')
    
    DATE_FORMAT = '%a, %d %b %Y %H:%M:%S %Z'
    dtcheckin = datetime.strptime(data_checkin, DATE_FORMAT)
    dtcheckout = datetime.strptime(data_checkout, DATE_FORMAT)    
    delta = dtcheckout - dtcheckin
    dias = delta.days

    valor = DIARIA * dias
    desconto = 0
    valor_final = valor    

    nova_reserva = Reservas(data_checkin,data_checkout,valor,id_usuario,desconto,valor_final)
    db.session.add(nova_reserva)
    db.session.commit()
    return jsonify({ 'retorno': 'ok', 'id_reserva': nova_reserva.id_reserva }), 201

@app.route("/getreservas", methods=["POST"])
@login_required
def getreservas():
    id_usuario = request.json.get('id_usuario')
    reservas_usr = []
    lista_reservas = Reservas.query.filter_by(usuario_id=id_usuario).all()
    for i in lista_reservas:        
        reservas_usr.append((i.data_checkin,i.data_checkout,i.status))
    dict_user = dt(list)
    dict_user[id_usuario] = reservas_usr
    return jsonify({ 'retorno': 'ok', 'reservas': dict_user }), 200

@app.route("/atualizareserva", methods=["POST"])
@login_required
def atualizareserva():
    reserva_id = request.json.get('id_reserva')
    acao = request.json.get('acao')
    if current_user.adm:
        possiveis_acoes = ['Aprovar','Cancelar']
        if acao not in possiveis_acoes:
            return jsonify({ 'retorno': 'Acao nao permitida' }), 422
        else:
            reserva = Reservas.query.filter_by(id_reserva=reserva_id).first()
            atualiza_reserva = reserva.update().where(id_reserva=reserva_id).values(status=acao)
            db.session.commit()
            return jsonify({'retorno': 'Reserva atualizada'}), 200
    else:
        possiveis_acoes = ['Cancelar']
        if acao not in possiveis_acoes:
            return jsonify({ 'retorno': 'Acao nao permitida' }), 422
        else:
            reserva = Reservas.query.filter_by(id_reserva=reserva_id).first()
            atualiza_reserva = reserva.update().where(id_reserva=reserva_id).values(status=acao)
            db.session.commit()
            return jsonify({'retorno': 'Reserva atualizada'}), 200

@app.route("/datasreservadas", methods=["GET"])
@login_required
def datasreservadas():
    datas = []
    for i in Reservas.query.all():
        datas.append(i.data_checkin)
        data_atual = i.data_checkin
        data_checkout = i.data_checkout
        while (data_atual != data_checkout):
            data_atual = data_atual + timedelta(days=1)
            datas.append(data_atual)
    return jsonify({ 'retorno': 'ok', 'datas': datas }), 200