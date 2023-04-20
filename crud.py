"""CRUD Operations"""

from model import connect_to_db, db, User, Collection, Outfit, Collection_outfit, Character, Shop, Item, Show
from datetime import date
from seed_api import *

# Create
def create_new_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user
def create_new_outfit(outfit_name, notes, character_id, user_id, public=False):
    """"Creating a new outfit"""

    date_created = date.today().strftime("%b-%d-%Y")

    outfit = Outfit(outfit_name=outfit_name, public=public, notes=notes, date_created=date_created, last_updated=date_created, 
                    character_id=character_id, user_id=user_id)
    return outfit


def create_new_collection(collection_name, user_id, public=False):
    """Create an empty collection"""
                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    date_created = date.today().strftime("%b-%d-%Y")

    collection = Collection(collection_name=collection_name, public=public, user_id=user_id, date_created=date_created, last_updated=date_created)
    return collection




# Read
def get_user_by_user_name_or_email(user_sign_on):
    "Get user object"
    user = db.session.query(User).filter((User.user_name == user_sign_on) | (User.email == user_sign_on)).first()
    return user
def get_colleciton(collection_id_or_name):
    """Get collection object"""
    if isinstance(collection_id_or_name, str):
        collection = db.session.query(Collection).filter(Collection.collection_name == collection_id_or_name).first()
        return collection
    else:
        collection = db.session.query(Collection).filter(Collection.collection_id == collection_id_or_name).first()
        return collection
def get_outfit_by_id_or_name(outfit_id_or_name):
    """Get outfit object"""
    if isinstance(outfit_id_or_name, str):
        outfit = db.session.query(Outfit).filter(Outfit.outfit_name == outfit_id_or_name).first()
        return outfit
    else:
        outfit = db.session.query(Outfit).filter(Outfit.outfit_id == outfit_id_or_name).first()
        return outfit

def get_character_by_name_or_id(character_name_or_id):
    """Get character object from db"""
    if isinstance(character_name_or_id, str):    
        character = db.session.query(Character).filter(Character.character_name == character_name_or_id).first()
        return character 
    else:
        character = db.session.query(Character).filter(Character.character_id == character_name_or_id) .first()
        return character
def get_show_by_id_or_name(name_of_show_or_id):
    """Get show object from db"""
    if isinstance(name_of_show_or_id, str):
        show_in_db = db.session.query(Show).filter(db.or_(Show.english_title == name_of_show_or_id, Show.japanese_title == name_of_show_or_id)).first()
        return show_in_db
    else:
        show_in_db = db.session.query(Show).filter(Show.show_id == name_of_show_or_id).first()
        return show_in_db
def get_users_outfits_by_id(user_id):
    """Get all oufit objects created by user"""
    outfits = db.session.query(Outfit).filter((Outfit.user_id == user_id)).all()
    return outfits
def get_users_collections_by_id(user_id):
    """Get all collection objects created by user"""
    collecitons = db.session.query(Collection).filter(Collection.user_id == user_id).all()
    return collecitons

# Update
def add_new_character(character_name, character_img, gender, show_id):
    """Add character to site db"""
    character = Character(character_image_URL=character_img, character_name=character_name, gender=gender, show_id=show_id)
    return character
def add_new_show(english_title, japanese_title, air_date):
    """Add Show to site db"""
    show = Show(english_title=english_title, japanese_title=japanese_title, air_date=air_date)
    return show
def add_outfit_to_collection(collection_id, outfit_id):
    """"Add a single outfit to collection"""
    outfit_collection = Collection_outfit(collection_id, outfit_id)
    return outfit_collection
def update_collection(collection_id):
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
def api_find_all_character_by_name(inputName):
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
def api_get_single_character(character_name):
    url = 'https://graphql.anilist.co'

    query = """
    query ($search: String) {
        Character(search: $search){
            name{
                full
            }
            gender
            image{
                medium
            }
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
    }"""

    variables = {
        'search': character_name,
    }
    return url, query, variables
def api_get_single_show_by_name(show_name):
    url = 'https://graphql.anilist.co'

    query = """
    query ($search: String) {
        Media(search: $search){
            title{
                english
                native
            }
            startDate{
                year, day, month
            }
        }
    }"""

    variables = {
        'search': show_name,
    }
    return url, query, variables


if __name__ == "__main__":
    from server import app

    connect_to_db(app)    