from flask import Flask, render_template, flash, request, session, redirect
from datetime import datetime
import requests
from model import connect_to_db, db, User, Collection, Outfit, Character, Shop, Item, Show
import crud
import os
from dotenv import dotenv_values

config = {
    **dotenv_values(".env.secret"),
    **os.environ,
}

app = Flask(__name__)
app.secret_key = 'secret_key'

# Display Webpages
@app.route('/')
def show_homepage():
    if 'user_info' not in session:
        session["user_info"] = {}
        session.modified = True
        return render_template("homepage.html")
    else:
        return render_template("homepage.html")

@app.route('/user_account')
def nav_user_acct_name():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("account.html")

@app.route('/user_collections')
def nav_user_collections():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("collections.html")

@app.route('/user_outfits')
def nav_user_outfits():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("outfits.html")

@app.route('/login')
def nav_login():
    return render_template("login.html")

@app.route('/characters')
def nav_character():
    return render_template("characters.html")

@app.route('/shows')
def nav_show():
    return render_template("shows.html")

@app.route('/create/new-outfit')
def nav_create_new_outfit_page():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("create.html", page_type="new_outfit")
    
@app.route('/create/new-collection')
def nav_create_new_collection_page():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("create.html", page_type="new_collection")

@app.route('/create')
def nav_create_page():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("create.html")

# api routes
@app.route('/disp_all_anime')
def disp_all_anime():
    url, query, variables = crud.get_all_anime()
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

@app.route('/find_character', methods=["POST"])
def disp_all_char_matches():
    inputName = request.get_json()

    url, query, variables = crud.api_find_all_character_by_name(inputName["name"])
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

#Sessions handling
@app.route('/handle_login', methods=['POST'])
def handle_login():
    """Log in user"""
    form = request.get_json()
    formType = form["formType"]
    response = {"message": False, "status": False, "user_name": ""}
        

    if form["user_name"] == None:
        response["message"] = "You haven't entered anything yet"
        return response


    
    if formType == "Login":
        user = crud.get_user_by_user_name_or_email(form["user_name"])
        if user == None:
            response["message"] = "Looks like we dont have that username or email. Click below to create an account."

        elif form["password"] != user.user_password:
            response["message"] = "Wrong Password"

        else: 
            response["message"] = "Logged in"
            response["status"] = True

            session["user_info"]["user_name"] = user.user_name
            session["user_info"]["user_id"] = user.user_id
            session["user_info"]["user_password"] = user.user_password
            session["user_info"]["email"] = user.email
            session.modified = True

        
    elif formType == "Create Account":
        user = crud.get_user_by_user_name_or_email(form["email"]) or crud.get_user_by_user_name_or_email(form["user_name"])
        
        if "@" not in form["email"]:
            response["message"] = "Please enter a valid email address"
        
        elif user != None:
            response["message"] = "Looks like that email or user name already exist. Please log in or click forgot password."
        
        elif None in form.values():
            response["message"] = "Please fill out all fields to create account"
        
        elif form["password"] != form["password2"]:
            response["message"] = "passwords do not match"
        
        else:
            user = crud.create_new_user(form["user_name"], form["password"], 
                                    form["fname"], form["lname"], form["email"])
            db.session.add(user)
            db.session.commit()

        if (user != None) and (user.user_password == form["password"]):
            response["message"] = "Account Created!"
            response["status"] = True
            response["user_name"] = user.user_name
            
            session["user_info"]["user_name"] = user.user_name
            session["user_info"]["user_id"] = user.user_id
            session["user_info"]["user_password"] = user.user_password
            session["user_info"]["email"] = user.email
            session.modified = True

        elif response["message"] == False:
            response["message"] = "There was an error in creating your account"

    return response

@app.route('/loggedIn')
def is_logged_in():
    response = {"status": False}
    if 'user_name' not in session['user_info']:
        return response
    else: 
        response["status"]=True
        return response

@app.route('/acct_info')
def get_acct_info():
    user = crud.get_user_by_user_name_or_email(session["user_info"]["user_name"])
    outfits = crud.get_users_outfits_by_id(user.user_id)
    collections = crud.get_users_collections_by_id(user.user_id)
    outfitInfo = []
    collectionInfo =[]
    for outfit in outfits:
        outfitCharImg = "Empty" if outfit.character_id == None else(crud.get_character_by_name_or_id(outfit.character_id).character_image_URL)
        outfitInfo.append((outfit.outfit_name, outfitCharImg))
    
    for collection in collections:
        collectionInfo.append((collection.collection_name, collection.last_updated.strftime("%B %d, %Y %H:%M:%S")))
        
    account_info = {"user_name": user.user_name, "date_created": (user.date_created).strftime("%b %d, %Y"), 
                    "count_outfits": len(outfits) , "count_collect": len(collections), "collectionInfo": collectionInfo, "outfitInfo": outfitInfo}

    return account_info

@app.route('/user_creations')
def get_user_creations():
    user = crud.get_user_by_user_name_or_email(session["user_info"]["user_name"])
    collections = crud.get_users_collections_by_id(user.user_id)
    outfits = crud.get_users_outfits_by_id(user.user_id)

    if len(collections) != 0:
        collecitons_info = []

        for collection in collections:
            char_list=[]
            outfit_list = []

            if collection.outfit_list != 0:
                for outfit in collection.outfit_list:
                    outfit_list.append(outfit.outfit_name)
                    char_list.append(crud.get_character_by_name_or_id(outfit.character_id).character_name)
            else:
                outfit_list.append("No Outfits in collection click the outfit tab and create a new one")
                char_list.append("No Outfits in collection click the outfit tab and create a new one")

            collecitons_info.append((collection.collection_name, collection.last_updated.strftime("%b-%d-%Y"), char_list, outfit_list))

        collection_names = [collection.collection_name for collection in collections]
    else:
        collection_names = ["No collections created. Select create new or no collection."]
    
    response = {"collection_names": collection_names, "collections_info": collecitons_info}
    return response

@app.route('/create_new_outfit', methods=["POST"])
def create_new():
# Getting form infomation
    form = request.get_json()
    formType = form["formType"]
    response = {"submit_status": False, "message": "Error in creating outfit"}
    user_id = session["user_info"]["user_id"]
#Adding charcter/show to site db after submission
    if crud.get_character_by_name_or_id(form["character_name"]) == None:
        url, query, variables = crud.api_get_single_character(form["character_name"])
        api_response = (requests.post(url, json={'query': query, 'variables': variables}).json())["data"]["Character"]
        gender = api_response['gender'][0]
        character_image_URL = api_response['image']['medium']
        show_name = api_response["media"]['edges'][0]['node']['title']['english']

        if crud.get_show_by_id_or_name(show_name) == None:
            url, query, variables = crud.api_get_single_show_by_name(show_name)
            api_show_response = (requests.post(url, json={'query': query, 'variables': variables}).json())["data"]["Media"]

            english_title = api_show_response['title']['english']
            japanese_title = api_show_response['title']['native']
            air_date = datetime(api_show_response['startDate']['year'], api_show_response['startDate']['month'], api_show_response['startDate']['day'])
            new_show = crud.add_new_show(english_title, japanese_title, air_date)
            db.session.add(new_show)
            db.session.commit()

        new_char = crud.add_new_character(form["character_name"], character_image_URL, gender, (crud.get_show_by_id_or_name(show_name)).show_id)
        db.session.add(new_char)
        db.session.commit()

# User created outfit
    outfit_public = True if form["outfit_public"] == "Public" else False
    new_outfit = crud.create_new_outfit(form["outfit_name"], form["outfit_notes"], crud.get_character_by_name_or_id(form["character_name"]).character_id, user_id, outfit_public)
    db.session.add(new_outfit)
    db.session.commit()

# User created new outfit add added to either a new or existing collection
    if formType == "createNew":
        collection_public = True if form["collection_public"] == "Public" else False
        new_col = crud.create_new_collection(form["collection_name"], user_id, collection_public)
        db.session.add(new_col)
        db.session.commit()

        new_col_out = crud.add_outfit_to_collection(crud.get_colleciton(form["collection_name"]).collection_id, crud.get_outfit_by_id_or_name(form["outfit_name"]).outfit_id)
        db.session.add(new_col_out)
        db.session.commit()

        reponse = {"submit_status": True, "message": "Outfit created"}
        return reponse
    
    elif formType == "useExist":
        new_col_out = crud.add_outfit_to_collection(crud.get_colleciton(form["collection_name"]).collection_id, crud.get_outfit_by_id_or_name(form["outfit_name"]).outfit_id)
        db.session.add(new_col_out)
        db.session.commit()
        
        reponse = {"submit_status": True, "message": "Outfit created"}
        return reponse

    else:
        reponse = {"submit_status": True, "message": "Outfit created"}
        return reponse  

if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
