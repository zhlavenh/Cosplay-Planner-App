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

# Sample data to feed seed mirror api data

anime_characters = {
    "Akeno Himejima": {"show_title": "High School DxD", "imgage_id": 0, "name": "Akeno Himejima", "gender": "F"},
    "Wendy Marvell": {"show_title": "Fairy Tail", "image_id": 1, "name": "Wendy Marvell", "gender": "F"},
    "Natsu Dragneel": {"show_title": "Fairy Tail", "image_id": 3, "name": "Natsu Dragneel", "gender": "M"},
    "Padan": {"show_title": "Mabinogi", "image_id": 4, "name": "Padan", "gender": "M"}
    "Lio Shirazumi": {"show_title": "Kara No Kyoukai: The Garden of Sinners", "image_id": 5, "name": "Lio Shirazumi", "gender": "X"}
}

anime_shows = {
    "Kara No Kyoukai: The Garden of Sinners": {"english_title": "Kara No Kyoukai: The Garden of Sinners", "japanese_title": "空の境界", "air_date": "2007/12/01"},
    "High School DxD": {"english_title": "High School DxD", "japanese_title": "ハイスクールD×D", "air_date": "2012/01/06"},
    "Fairy Tail": {"english_title": "Fairy Tail", "japanese_title": "FAIRY TAIL", "air_date": "2009/10/12"},
    "Mabinogi":, {"english_title": "Mabinogi", "japanese_title": "マビノギ", "air_date": "2007/12/00"}
}

# Seeding data
for n in range(5):
    user_name = f"UserName{n}"
    user_password = "test"
    fname = f"FirstName{n}"
    lname = f"LastName"
    email = f"user{n}@test.com"  # Voila! A unique email!

    user = crud.create_user(user_name, user_password, fname, lname, email)
    model.db.session.add(user)

model.db.session.commit()

