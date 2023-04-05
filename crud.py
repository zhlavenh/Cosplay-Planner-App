"""CRUD Operations"""

import model
from datetime import date

def create_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    date_created = date.today().strftime("%b-%d-%Y")

    user = model.User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email, date_created=date_created)
    
    return user

if __name__ == "__main__":
    from server import app

    connect_to_db(app)    