"""CRUD Operations"""

import model

def create_user(user_name, user_password, fname, lname, email):
    """Create a new user."""

    user = User(user_name=user_name, user_password=user_password, 
                fname=fname, lname=lname, email=email)
    
    return user

if __name__ == "__main__":
    from server import app

    connect_to_db(app)    