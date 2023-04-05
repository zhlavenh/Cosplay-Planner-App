from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user"""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(20), unique=True)
    user_password = db.Column(db.String(20))
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(30), nullable=False, unique=True)
    date_created = db.Column(db.Date)

    def __repr__(self):
        return f"<User: {self.user_name} member since: {self.created_at}>"  
    
class Outfit(db.Model):
    """A User created outfit"""

    __tablename__ = "outfits"

    outfit_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    outfit_name = db.Column(db.String(40), nullable=False)
    public = db.Column(db.Boolean, nullable=False, default=True)
    notes = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    character_id = db.Column(db.Integer, db.ForeignKey('characters.character_id'))
    collection_id = db.relationship('Collection', secondary='collection_outfits', backref=('outfits'))

    def __repr__(self):
        return f"<User: {self.user_id} created: {self.outfit_name}/{self.outfit_id} based on: {self.character_id}>"
    
class Collection(db.Model):
    """A User created collection"""

    __tablename__ = "collections"

    collection_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    collection_name = db.Column(db.String(40), nullable=False)
    public = db.Column(db.Boolean, nullable=False, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    outfit_id = db.relationship('Outfit', secondary='collection_outfits', backref=('collections'))

    def __repr__(self):
        return f"<User: {self.user_id} created: {self.collection_name}/{self.collection_id}>" 

class Collection_outfit(db.Model):
    """A table for many to many assocition between outfits and collections"""

    __tablename__ = "collection_outfits"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    collection_id = db.Column(db.Integer, db.ForeignKey('collections.collection_id'))
    outfit_id = db.Column(db.Integer, db.ForeignKey('outfits.outfit_id'))

class Character(db.Model):
    """A single character from a show"""

    __tablename__ = "characters"

    character_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    character_image_id = db.Column(db.Integer, nullable=False)
    character_name = db.Column(db.String(30), nullable=False)
    gender = db.Column(db.String(1))
    show_id = db.Column(db.Integer, db.ForeignKey('shows.show_id'))
    english_voice_actor = db.Column(db.String(30))
    japanese_voice_actor = db.Column(db.String(30))

    def __repr__(self):
        return f"<Charater name: {self.character_name}>" 
    
class Shop(db.Model):
    """A shopping site"""

    __tablename__ = "shops"

    shop_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shop_name = db.Column(db.String(30), nullable=False)
    shop_link = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<Shop name: {self.shop_name}>"
    
class Item(db.Model):
    """A cosplay item"""

    __tablename__ = "items"

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    item_type = db.Column(db.String(10), nullable=False)
    item_name = db.Column(db.String(50), nullable=False)
    item_cost = db.Column(db.Float, nullable=False)
    shop_id = db.Column(db.Integer, db.ForeignKey('shops.shop_id'))
    outfit_id = db.Column(db.Integer, db.ForeignKey('outfits.outfit_id'))

    def __repr__(self):
        return f"<Item type: {self.item_type} item id: {self.item_id}>"
    
class Show(db.Model):
    """An anime"""

    __tablename__ = "shows"

    show_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    english_title = db.Column(db.String(40), nullable=False)
    japanese_title = db.Column(db.String(40), nullable=False)
    air_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return f"<Shop name: {self.shop_name}>"


def connect_to_db(app):
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///cosplay_planner"
    app.config["SQLALCHEMY_ECHO"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = app
    db.init_app(app)
    print("Connected to database!")

if __name__ == "__main__":
    from server import app

    connect_to_db(app)