from app import app
from flask import render_template

# @app.route("/login", methods=["POST"])
# def login():
#     username = request.json.get('username')
#     password = request.json.get('password')
#     return jsonify({ 'nome': 'eitchaa' }), 201

@app.route("/home")
@app.route("/index/<user>")
@app.route("/",defaults={"user:None"})
def index(user):
    return render_template('index.html',user=user)

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

