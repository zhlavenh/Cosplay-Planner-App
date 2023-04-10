"""Script to seed database."""

import os
import json
from random import choice, sample, randint
from seed_api import *

import crud
import model
import server

os.system("dropdb cosplay_planner")
os.system("createdb cosplay_planner")

model.connect_to_db(server.app)
model.db.create_all()

# Sample data to feed seed mirror api data



# Seeding data'

# Create user
for n in range(5):
    user_name = f"UserName{n}"
    user_password = "test"
    fname = f"FirstName{n}"
    lname = f"LastName"
    email = f"user{n}@test.com"  # Voila! A unique email!

    user = crud.create_user(user_name, user_password, fname, lname, email)
    model.db.session.add(user)
model.db.session.commit()

# Create an empty collection
for n in range(5):
    collection_name = f"Empty User collection {n}"
    public = choice([True, False])

    collection = crud.create_empty_collection(collection_name, public)
    model.db.session.add(collection)
model.db.session.commit()

# create a new outfit (Choose random charcter from list for seed)
for n in range(5):
    outfit_name = f"Test Outfit #{n}"
    public = choice([True, False])
    collection = choice([True, False])
    notes = "".join(sample(test_notes, k=50))
    character_id = crud.find_character(choice([x for x in anime_characters.keys()]))

    outfit = crud.create_new_outfit(outfit_name, public, notes, character_id, collection)
    model.db.session.add(outfit)
model.db.session.commit()






    

