import os
from flask import Flask, flash
import sqlite3 as sql
from flask_login import LoginManager
from flask_login import login_user
from flask import render_template
from functools import wraps
from flask import request, Response
from flask import jsonify
import json
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

lm = LoginManager()
lm.init_app(app)

class Usuario(object):

    id = 0

    def __init__(self,username,password,name,email):
        self.username = username
        self.password = password
        self.name = name
        self.email = email

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)


@app.route("/login", methods=["POST"])
def login():
    user = Usuario('ijui','1234','gabriel','gabriel@blablabla')
    username = request.json.get('username')
    password = request.json.get('password')
    return jsonify({ 'nome': user.name }), 201



    # if username == 'ijui' and password == '1234':
    #     #login_user(user)
    #     return 200
    # else:
    #     return 400


@app.route('/', methods=['POST','GET'])
def helloworld():
    return 'Hello world'



# def home():
#     if request.method=='POST':
#         username = request.form['username']
#         password = request.form['password']
#         insertUser(username,password)
#         users = retriveUsers()
#         return render_template('index.html', users=users)
#     else:
#         return render_template('index.html')


if __name__ == "__main__":
    port = int(os.environ.get("PORT",5000))
    app.run(host='0.0.0.0', port=port)

