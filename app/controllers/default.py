from app import app,db
from flask import render_template
from app.models.forms import LoginForm
from app.models.tables import Usuario

# @app.route("/login", methods=["POST"])
# def login():
#     username = request.json.get('username')
#     password = request.json.get('password')
#     return jsonify({ 'nome': 'eitchaa' }), 201


@app.route("/teste/<info>")
@app.route("/teste",defaults={"info":None})
def teste(info):
    i = Usuario("gabriel.weich@bol.com.br",123456,"Gabriel Weich",51995592474)
    db.session.add(i)
    db.session.commit()



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

