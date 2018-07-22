from app import app,db, lm
from flask import render_template, flash
from app.models.forms import LoginForm
from app.models.tables import Usuario
from app.models.tables import Codigos
from flask import request
from flask import jsonify
import random
from flask_login import login_user, logout_user, login_fresh, login_required, current_user

@lm.user_loader
def load_user(id):
    return Usuario.query.filter_by(id=id).first()

@app.route("/estalogado", methods=["GET"])
def estalogado():
    if login_fresh():
        return jsonify({'retorno': 'usuario logado'}), 200
    else:
        return jsonify({'retorno': 'usuario nao logado, ou sessao expirada'}), 422

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get('email')
    senha = request.json.get('senha')
    usuario = Usuario.query.filter_by(email=email).first()
    if usuario and usuario.password == senha:
        login_user(usuario)
        id_usuario = usuario.id
        return jsonify({'retorno': 'usuario logado', 'id_usuario': id_usuario}), 200
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
        novoUsuario = Usuario(email,senha,nome,telefone)
        codigoUsado = Codigos.query.filter_by(codigo=codigo).first()
        db.session.add(novoUsuario)
        db.session.delete(codigoUsado)
        db.session.commit()
        id_usuario = novoUsuario.id
        return jsonify({ 'retorno': 'ok', 'id_usuario': id_usuario }), 201
    else:
        return jsonify({ 'retorno': 'codigo incorreto' }), 422