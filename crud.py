"""CRUD Operations"""

from model import connect_to_db, db, User, Collection, Outfit, Character, Shop, Item, Show
from datetime import date
from seed_api import *



def create_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user
def get_user_info(userName, password):
    """Find exisiting user in db"""

    user_info = db.session.query(User).filter((User.user_name == userName) | (User.email == userName)).first()

    if user_info == None:
        return "Looks like we dont have that username or email. Click below to create an account."
    elif password != user_info.user_password:
        return "Wrong password"
    else:
        return "Successful login"

def find_show(name_of_show):
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

def db_find_character(name_of_character):
#     # First search api to see if chacter exist
#     # If character is in database return character id
#     # Else create new character entry into database 
    character_in_db = db.session.query(Character).filter(Character.character_name == name_of_character).first()

    # if character_in_db == None:
    #     # This is where it is searching the api and getting information on character
    #     # character_info = anime_characters[name_of_character]
    
    #     # show_id = find_show(character_info["show_title"])
    #     # character_to_db = Character(character_name=name_of_character, gender=character_info["gender"], show_id=show_id)
    #     # db.session.add(character_to_db)
    #     # db.session.commit()
    #     # character_in_db = db.session.query(Character).filter(Character.character_name == name_of_character).first()
    #     # return character_in_db.character_id

    # else:
    #     return character_in_db.character_id


# Create a new outfit > req: select character, name | opt: add to new collection, add to existing collection, from drop down list
def create_new_outfit(outfit_name, public, notes, character_id, collection=False):
    """"Creating a new outfit"""

    date_created = date.today().strftime("%b-%d-%Y")
    # Default is the inital creation date
    # Using this for seeding production would come from flask session
    # user_id = db.session.query(User.user_id).all()
    # Character_id will come from find_charcter function from api.

    outfit = Outfit(outfit_name=outfit_name, public=public, notes=notes, date_created=date_created, last_updated=date_created, character_id=character_id)
    return outfit

# Create new collection > req: select public status, name
def create_empty_collection(collection_name, public):
    """Create an empty collection"""
    
    date_created = date.today().strftime("%b-%d-%Y")

    collection = Collection(collection_name=collection_name, public=public, date_created=date_created, last_updated=date_created)
    return collection

# Update existing outfit > change name, add/remove collection, delete outfit, add/remove items
def update_outfit(outfit_id, outfit_new_name, add_to_col=False):
    # change name
    outfit_obj = (db.session.query(Outfit).filter(Outfit.outfit_id == outfit_id).first())
    create
    

    # add to existing collection
    # add to new collection
    # 
def add_outfit_to_collection(collection):
    return None

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
# Button on character page to crete outfit based using character name.

# Update collection > add/remove outfit, change name, change public status, delete collection




if __name__ == "__main__":
    from server import app

    connect_to_db(app)    