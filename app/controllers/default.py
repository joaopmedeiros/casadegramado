from app import app,db
from flask import render_template
from app.models.forms import LoginForm
from app.models.tables import Usuario
from app.models.tables import Codigos
from flask import request
from flask import jsonify
import random

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login", methods=["POST","GET"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        print(form.username.data)
        print(form.password.data)
    else:
        print(form.errors)
    return render_template('login.html', form=form)

@app.route("/geracodigo", methods=["GET"])
def geraCodigo():
    codigosExistentes = [x.codigo for x in Codigos.query.all()]
    algarismos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
              'V',
              'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    while(True):
        codigo = ''.join([algarismos[random.randint(0, len(algarismos) - 1)] for x in range(6)])
        if codigo not in codigosExistentes:
            break
    novoCodigo = Codigos(codigo)
    db.session.add(novoCodigo)
    db.session.commit()
    return str(codigo)

@app.route("/cadastra",methods=["POST"])
@app.route("/teste",methods=["POST"])
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
        return jsonify({ 'retorno': 'ok' }), 201
    else:
        return jsonify({ 'retorno': 'codigo incorreto' }), 422




# @app.route("/teste/<info>")
# @app.route("/teste",defaults={"info":None})
# def teste(info):
#     i = Usuario.query.filter_by(email="gabriel.weich@bol.com.br").first()
#     return "{},{},{}".format(i.email,i.nome,i.password)




# @app.route("/test")
# @app.route("/test/<name>")
# def teste(name=None):
#     if name:
#         return "Ola {}!".format(name)
#     else:
#        return "Ola, usuario"


# @app.route("/test/<int:id>", methods=["GET","POST"])
# def test(id):
#     return str(id)

