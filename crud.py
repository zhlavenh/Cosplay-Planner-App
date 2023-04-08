"""CRUD Operations"""

import model
from datetime import date

def create_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = model.User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user

def character_search(character_name):


# Create a new outfit > req: select character, name | opt: add to new collection, add to existing collection, from drop down list
def create_new_outfit(outfit_name, public, notes, character_id, collection=False):
    """"Creating a new outfit"""

    public = public
    notes = notes
    date_created = date.today().strftime("%b-%d-%Y")
    # Default is the inital creation date
    last_updated = date_created

    # Using this for seeding production would come from flask session
    user_id = db.session.query(User.user_id).all()
    character_id = 


    # User selection colleciton action
    if collection == "new collection":
        # Prompt user for name of collection
            # create_new_collection(collection_name, public) return collection_id

    outfit = model.Outfit(outfit_name=outfit_name, public=(public="pulic"), notes=notes, user_ )



# Button on character page to crete outfit based using character name.
# Create new collection > req: select public status, name
# Update existing outfit > change name, add/remove collection, delete outfit, add/remove items
# Update collection > add/remove outfit, change name, change public status, delete collection




if __name__ == "__main__":
    from server import app

    connect_to_db(app)    