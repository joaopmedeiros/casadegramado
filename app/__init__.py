from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)
CORS(app)


from app.models import tables
migrate = Migrate(app,db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

from app.models import tables
from app.controllers import default