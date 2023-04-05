"""CRUD Operations"""

import model
from datetime import date

def create_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = model.User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user

def create_new_outfit(outfit_name, public, notes, user_id, character_id):

# Create a new outfit > req: select character, name | opt: add to new collectiomn, add to existing collection
# Create new collection > req: select public status, name
# Update existing outfit > change name, add/remove collection, delete outfit, add/remove items
# Update collection > add/remove outfit, change name, change public status, delete collection




if __name__ == "__main__":
    from server import app

    connect_to_db(app)    