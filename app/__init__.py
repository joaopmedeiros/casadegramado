from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_cors import CORS
from flask_login import LoginManager

app = Flask(__name__, static_folder="./client/build/static", template_folder="./client/build")
app.config.from_object('config')
db = SQLAlchemy(app)
CORS(app)


from app.models import tables
migrate = Migrate(app,db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

lm = LoginManager()
lm.init_app(app)

from app.models import tables
from app.controllers import default