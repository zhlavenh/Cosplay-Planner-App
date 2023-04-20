"""Script to seed database."""

import os
import json
from random import choice, sample, randint
from seed_api import *

import crud
from model import connect_to_db, db, User, Collection, Outfit, Character, Shop, Item, Show
import server

os.system("dropdb cosplay_planner")
os.system("createdb cosplay_planner")

connect_to_db(server.app)
db.create_all()

# Sample data to feed seed mirror api data



# Seeding data'

# Create user
for n in range(5):
    user_name = f"UserName{n}"
    user_password = "test"
    fname = f"FirstName{n}"
    lname = f"LastName"
    email = f"user{n}@test.com"  # Voila! A unique email!

    user = crud.create_new_user(user_name, user_password, fname, lname, email)
    db.session.add(user)
db.session.commit()

# Create an empty collection
for n in range(5):
    collection_name = f"Empty User collection {n}"
    public = choice([True, False])
    userId = choice([user[0] for user in db.session.query(User.user_id).all()])
    collection = crud.create_new_collection(collection_name, public=public, user_id=userId)
    db.session.add(collection)
db.session.commit()

show = crud.add_new_show(english_title="Test Show", japanese_title="ランダムショー", air_date="2023/02/23")
db.session.commit()

# Adding random charcters
for n in range(5):
    character_name = f"Char Random #{n}"
    character_img = "url string"
    gender = choice(["M", "F", "N"])
    show_id = db.session.query(Show.show_id).first()
    character = crud.add_new_character(character_name, character_img, gender, show_id)
    db.session.add(character)
db.session.commit()

# create a new outfit (Choose random charcter from list for seed)
for n in range(5):
    outfit_name = f"Test Outfit #{n}"
    notes = "".join(sample(test_notes, k=50))
    character_id = choice([char[0] for char in db.session.query(Character.character_id).all()])
    user_id = randint(1, 4)
    public = choice([True, False])
    outfit = crud.create_new_outfit(outfit_name, notes, character_id, user_id, public)
    db.session.add(outfit)
db.session.commit()

# Create new empty collections
for n in range(5):
    collection_name = f"Test collection {n}"
    user_id = randint(1, 5)
    public = choice([True, False])
    colletion = crud.create_new_collection(collection_name, user_id, public)
    db.session.add(collection)
db.session.commit()

# Add outfit to collection
for n in range(2):
    collection_id = randint(1,5)
    outfit_id = randint(1,5)
    out_col = crud.add_outfit_to_collection(collection_id=collection_id, outfit_id=outfit_id)
    db.session.add(out_col)
db.session.commit()