"""Script to seed database."""

import os
import json

import crud
import model
import server

os.system("dropdb cosplay_planner")
os.system("createdb cosplay_planner")

model.connect_to_db(server.app)
model.db.create_all()

for n in range(5):
    user_name = f"UserName{n}"
    user_password = "test"
    fname = f"FirstName{n}"
    lname = f"LastName"
    email = f"user{n}@test.com"  # Voila! A unique email!

    user = crud.create_user(user_name, user_password, fname, lname, email)
    model.db.session.add(user)

model.db.session.commit()

