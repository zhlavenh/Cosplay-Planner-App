"""CRUD Operations"""

import model
from datetime import date
from seed_api import *



def create_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = model.User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user

def find_show(name_of_show):
    show_in_db = model.db.session.query(model.Show).filter(model.Show.english_title == name_of_show).first()
    if show_in_db == None:
        #This is where it will search api and gather informaiton on show
        show_info = anime_shows[name_of_show]
        show_to_db = model.Show(english_title=name_of_show, japanese_title=show_info["japanese_title"])
        model.db.session.add(show_to_db)
        model.db.session.commit()
        show_in_db = model.db.session.query(model.Show).filter(model.Show.english_title == name_of_show).first()
        return show_in_db.show_id
    else:
        return show_in_db.show_id

def find_character(name_of_character):
#     # First search api to see if chacter exist
#     # If character is in database return character id
#     # Else create new character entry into database 
    character_in_db = model.db.session.query(model.Character).filter(model.Character.character_name == name_of_character).first()

    if character_in_db == None:
        # This is where it is searching the api and getting information on character
        character_info = anime_characters[name_of_character]
    
        show_id = find_show(character_info["show_title"])
        character_to_db = model.Character(character_name=name_of_character, gender=character_info["gender"], show_id=show_id)
        model.db.session.add(character_to_db)
        model.db.session.commit()
        character_in_db = model.db.session.query(model.Character).filter(model.Character.character_name == name_of_character).first()
        return character_in_db.character_id

    else:
        return character_in_db.character_id


# Create a new outfit > req: select character, name | opt: add to new collection, add to existing collection, from drop down list
def create_new_outfit(outfit_name, public, notes, character_id, collection=False):
    """"Creating a new outfit"""

    public = public
    notes = notes
    date_created = date.today().strftime("%b-%d-%Y")
    # Default is the inital creation date
    # Using this for seeding production would come from flask session
    # user_id = model.db.session.query(User.user_id).all()

    # Drop down list that will return the chracter id only. this code below will change for that.

    outfit = model.Outfit(outfit_name=outfit_name, public=(public=="pulic"), notes=notes, date_created=date_created, last_updated=date_created, character_id=character_id)
    return outfit



# Button on character page to crete outfit based using character name.
# Create new collection > req: select public status, name
# Update existing outfit > change name, add/remove collection, delete outfit, add/remove items
# Update collection > add/remove outfit, change name, change public status, delete collection




if __name__ == "__main__":
    from server import app

    connect_to_db(app)    