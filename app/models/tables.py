from app import db

class Usuario(db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.BigInteger)
    nome = db.Column(db.String)
    celular = db.Column(db.BigInteger, unique=True)
    adm = db.Column(db.Boolean)

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

    def __init__(self, email, password, nome, celular):
        self.email = email
        self.password = password
        self.nome = nome
        self.email = email
        self.celular = celular

    def __repr__(self):
        return "<Email Usuario %r>" % self.email

class Codigos(db.Model):
    __tablename__ = "codigos"
    id_codigo = db.Column(db.Integer,primary_key=True)
    codigo = db.Column(db.String, unique=True)

    def __init__(self,codigo):
        self.codigo = codigo

class Reservas(db.Model):
    __tablename__ = "reservas"
    id_reserva = db.Column(db.Integer, primary_key=True)
    data_checkin = db.Column(db.Date)
    data_checkout = db.Column(db.Date)
    valor = db.Column(db.Float)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    desconto = db.Column(db.Float)
    valor_final = db.Column(db.Float)

    usuario = db.relationship('Usuario', foreign_keys=usuario_id)

    def __init__(self, data_checkin, data_checkout, valor, usuario_id, desconto, valor_final):
        self.data_checkin = data_checkin
        self.data_checkout = data_checkout
        self.valor = valor
        self.usuario_id = usuario_id
        self.desconto = desconto
        self.valor_final = valor_final

    def __repr__(self):
        return "<Reserva %r>" % self.id_reserva


class Tarifario(db.Model):
    __tablename__ = "tarifario"
    id_tarifa = db.Column(db.Integer, primary_key=True)
    data_inicial = db.Column(db.Date)
    data_final = db.Column(db.Date)
    valor_diaria = db.Column(db.Float)
    descricao = db.Column(db.Text)

    def __init__(self,data_inicial,data_final,valor_diaria,descricao):
        self.data_inicial = data_inicial
        self.data_final = data_final
        self.valor_diaria = valor_diaria
        self.descricao = descricao

    def __repr__(self):
        return "<Tarifa %r>" % self.id_tarifa