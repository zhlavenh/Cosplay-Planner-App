"""CRUD Operations"""

from model import connect_to_db, db, User, Collection, Outfit, Character, Shop, Item, Show
from datetime import date
from seed_api import *

# Create
def create_new_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user
def create_new_outfit(outfit_name, public, notes, character_id, user_id, collection=False, collection_name=None, col_public=None):
    """"Creating a new outfit"""
    collection_id = None

    if collection != False:
        collection_id = get_colleciton(collection_id)
        if collection_id == None:
            create_empty_collection(collection_name, col_public, user_id)
            collection_id = get_colleciton(collection_name).collection_id
    date_created = date.today().strftime("%b-%d-%Y")
    outfit = Outfit(outfit_name=outfit_name, public=public, notes=notes, date_created=date_created, last_updated=date_created, character_id=character_id, user_id=user_id, collection_id=collection_id)
    return outfit
def create_empty_collection(collection_name, public, user_id):
    """Create an empty collection"""
    
    date_created = date.today().strftime("%b-%d-%Y")

    collection = Collection(collection_name=collection_name, public=public, user_id=user_id, date_created=date_created, last_updated=date_created)
    return collection


# Read
def get_user_by_user_name_or_email(user_sign_on):
    "Get user"
    user = db.session.query(User).filter((User.user_name == user_sign_on) | (User.email == user_sign_on)).first()
    return user
def get_colleciton(collection_id_or_name):
    collection = db.session.query(Collection).filter((Collection.collection_id == collection_id_or_name) | (Collection.collection_name == collection_id_or_name)).first()
    return collection
def get_outfit(outfit_id):
    return None
def get_character(character_name_or_id):
    charcter = db.session.query(Character).filter((Character.character_id == character_name_or_id) | (Character.character_name == character_name_or_id)).first()
    return charcter 
def get_show(name_of_show):
    show_in_db = db.session.query(Show).filter(Show.english_title == name_of_show).first()
    if show_in_db == None:
        #This is where it will search api and gather informaiton on show
        show_info = anime_shows[name_of_show]
        show_to_db = Show(english_title=name_of_show, japanese_title=show_info["japanese_title"])
        db.session.add(show_to_db)
        db.session.commit()
        show_in_db = db.session.query(Show).filter(Show.english_title == name_of_show).first()
        return show_in_db.show_id
    else:
        return show_in_db.show_id
def get_users_outfits_by_id(user_id):
    outfits = db.session.query(Outfit).filter((Outfit.user_id == user_id)).all()
    return outfits
def get_users_collections_by_id(user_id):
    collecitons = db.session.query(Collection).filter(Collection.user_id == user_id).all()
    return collecitons

# Update
def add_show(name_of_show):
    return None
def update_outfit(outfit_id):
    return None
def update_collection(collection_id):
    return None
def add_character(charater_name):
    return None

# Delete

# API Fucntions
def get_all_characters():
    url = 'https://graphql.anilist.co'
    query = """
    query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
            characters{
                id
                name{
                    full
                }
                gender
                media{
                    edges{
                        node{
                            title{
                                english
                            }
                        }
                    }
                }
            }
        }
    }
    """

    variables = {
        'page': 1,
        'perPage': 5
    }
    return url, query, variables

def get_all_anime():
    url = 'https://graphql.anilist.co'
    query = """
    query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
            media(type:ANIME){
                title{
                    english
                    native
                }
                startDate{
                    year, day, month
                }
                coverImage{
                    medium
                }
            }
        }
    }"""

    variables = {
        'page': 1,
        'perPage': 50
    }
    return url, query, variables

def api_find_character(inputName):
    url = 'https://graphql.anilist.co'
    query = """
    query ($page: Int, $perPage: Int, $search: String) {
        Page(page: $page, perPage: $perPage){
            characters (search: $search) {
                name{
                    full
                }
            }
        }

    }
    """
    variables = {
        'search': inputName,
        'page': 1,
        'perPage': 6
    }
    return url, query, variables


if __name__ == "__main__":
    from server import app

    connect_to_db(app)    