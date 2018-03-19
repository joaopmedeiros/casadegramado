from app import app
from flask import Flask, flash
from flask_login import LoginManager
from flask import request, Response
from flask import jsonify
from flask_cors import CORS

#
#
# @app.route("/login", methods=["POST"])
# def login():
#     username = request.json.get('username')
#     password = request.json.get('password')
#     return jsonify({ 'nome': 'eitchaa' }), 201


@app.route('/', methods=['POST','GET'])
def helloworld():
    return 'Hello world'

if __name__ == "__main__":
    port = int(os.environ.get("PORT",5000))
    app.run(host='0.0.0.0', port=port)

