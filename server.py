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

@app.route('/my-accounts')
def nav_user_acct_name():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("account.html")

@app.route('/my-collections')
def nav_user_collections():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("collections.html", page_type="base")

@app.route('/my-collections/<collection_name>')
def nav_to_collection(collection_name):
    return render_template("collections.html", page_type="collection")

@app.route('/my-outfits')
def nav_user_outfits():
    
    if 'user_name' not in session["user_info"]:
        return redirect('/login')
    else:
        return render_template("outfits.html", page_type="base")

@app.route('/my-outfits/<outfit_name>')
def nav_to_outfit(outfit_name):
    return render_template("outfits.html", page_type="ind_outfit")

@app.route('/login')
def nav_login():
    return render_template("login.html")

@app.route('/characters')
def nav_character():
    return render_template("characters.html", page_type="base")

@app.route('/characters/<character_name>')
def show_character_page(character_name):

    return render_template("characters.html", page_type="ind_character_page")

@app.route('/shows')
def nav_show():
    return render_template("shows.html", page_type="base")

@app.route('/shows/<show_title>')
def show_show_page(show_title):
    
    return render_template("shows.html", page_type="ind_show_page")

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

# POST and GETS
# api routes
@app.route('/disp_all_anime', methods=["POST"])
def disp_all_anime():
    page_change = request.get_json()
    page_number = page_change["page"]

    url, query, variables = crud.get_all_anime()
    variables = {"page": page_number, "perPage": 20}
    response = requests.post(url, json={'query': query, 'variables': variables}).json()['data']['Page']
    return response

@app.route('/disp_all_characters', methods=["POST"])
def disp_all_characters():
    page_change = request.get_json()
    page_number = page_change["page"]

    url, query, variables = crud.get_all_characters()
    variables = {"page": page_number, "perPage": 9}
    response = requests.post(url, json={'query': query, 'variables': variables}).json()['data']['Page']
    return response

@app.route('/find_character', methods=["POST"])
def disp_all_char_matches():
    inputName = request.get_json()

    url, query, variables = crud.api_find_all_character_by_name(inputName["name"])
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

@app.route('/find_single_character', methods=["POST"])
def disp_character_info():
    inputName = request.get_json()

    url, query, variables = crud.api_get_single_character(inputName["name"])
    char_info = requests.post(url, json={'query': query, 'variables': variables}).json()["data"]["Character"]
    show_list = {}

    for show in char_info["media"]["edges"]:
        show_id = show["node"]["id"]
        show_list[show_id] = show_list.get(show_id, {"eng_title": show["node"]["title"]["english"], 
                                                     "native_title": show["node"]["title"]["native"], "show_img": show["node"]["coverImage"]["medium"]})

    response = {"img": char_info["image"]["medium"], "eng_name": char_info["name"]["full"], "native_name": char_info["name"]["native"], 
                "age": char_info["age"], "description": char_info["description"], "gender": char_info["gender"], "appears_in": show_list}

    return response

@app.route("/find_show", methods=["POST"])
def disp_show_info():
    show_title = request.get_json()["showName"]
    url, query, variables = crud.api_get_single_show_by_name(show_title)
    show_info = requests.post(url, json={'query': query, 'variables': variables}).json()["data"]["Media"]

    character_dic = {}
    for character in show_info["characters"]["edges"]:
        character_id = character["node"]["id"]
        character_img = character["node"]["image"]["medium"]
        character_eng_name = character["node"]["name"]["full"]
        character_native_name = character["node"]["name"]["native"]

        character_dic[character_id] = character_dic.get(character_id, {"character_img": character_img, "character_eng_name": character_eng_name, "character_native_name": character_native_name})

    if show_info['endDate']['year'] == None: 
        endDate = "--/--/----"
    else:
        endDate = datetime(show_info['endDate']['year'], show_info['endDate']['month'], show_info['endDate']['day']).strftime("%B/%d/%Y")

    response = {"show_info":{"show_img": show_info['coverImage']["medium"], "show_eng_title": show_info['title']['english'], "show_native_title": show_info['title']['native'], 
                "start_date": datetime(show_info['startDate']['year'], show_info['startDate']['month'], show_info['startDate']['day']).strftime("%B/%d/%Y"), 
                "end_date": endDate, 
                "show_description": show_info["description"], "num_episodes": show_info["episodes"]}, "characters_in_show": character_dic}
    return response

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
        collectionInfo.append((collection.collection_name, collection.last_updated.strftime("%B %d, %Y"), len(collection.outfit_list)))
        
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

@app.route('/get_outfit_info', methods=["POST"])
def get_user_outfit_info():
    outfit_name = request.get_json()["name"]
    outfit =  crud.get_outfit_by_id_or_name(outfit_name)
    character = crud.get_character_by_name_or_id(outfit.character_id)
    collections = {}

    for collection in outfit.collection_list:
        collection_name = crud.get_colleciton(collection.collection_id).collection_name
        collections[collection.collection_id] = collections.get(collection.collection_id, collection_name)

    response = {"outfit_name": outfit.outfit_name, "based_on": character.character_name, "based_on_img": character.character_image_URL, 
                "collecitons_in": collections, "notes": outfit.notes}

    return response

@app.route('/get_collection_info', methods=["POST"])
def get_user_collection_info():
    form = request.get_json()
    print(f"*****{form}")
    collection = crud.get_colleciton(form["name"])
    char_list=[]
    outfit_list = []

    if collection.outfit_list != 0:
        for outfit in collection.outfit_list:
            outfit_list.append(outfit.outfit_name)
            char_list.append({"char_name": crud.get_character_by_name_or_id(outfit.character_id).character_name, 
                              "char_img": crud.get_character_by_name_or_id(outfit.character_id).character_image_URL})
    else:
        outfit_list.append("No Outfits in collection click the outfit tab and create a new one")
        char_list.append("No Outfits in collection click the outfit tab and create a new one")

    response = {"collection_name": form["name"], "char_list": char_list, "outfit_list": outfit_list}
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

@app.route('/create_new_col', methods=["POST"])
def create_new_col():
    form = request.get_json()

    new_col = crud.create_new_collection(form["collection_name"], session["user_info"]["user_id"], True if form["public"]=="Public" else False)
    db.session.add(new_col)
    db.session.commit()

    if form["outfitsList"] != 0 :
        collection_id = crud.get_colleciton(form["collection_name"]).collection_id
        for outfit in form["outfitsList"]:
            outfit_id = crud.get_outfit_by_id_or_name(outfit).outfit_id
            add_out = crud.add_outfit_to_collection(collection_id, outfit_id)
            db.session.add(add_out)
            db.session.commit()
    response = {"message": "successful"}
    return response

@app.route('/update_outfit', methods=["POST"])
def update_outfit():
    form = request.get_json()
    outfit_id = crud.get_outfit_by_id_or_name(form["current_outfit"]).outfit_id
    response = {"message": "success"}

    if form["change_name"] != None:
        crud.change_outfit_name(outfit_id, form["change_name"])
        db.session.commit()
        return response
    elif form["add_col"] != None:
        for collection in form["add_col"]:
            collection_id = crud.get_colleciton(collection).collection_id
            out_col = crud.add_outfit_to_collection(collection_id, outfit_id)
            db.session.add(out_col)
            db.session.commit()
        return response
    elif form["remove_col"] != None:
        for collection in form["remove_col"]:
            collection_id = crud.get_colleciton(collection).collection_id
            collection_object = crud.get_collection_outfit_object(outfit_id, collection_id)
            db.session.delete(collection_object)
            db.session.commit()
        return response
    elif form["notes"] != None:
        crud.get_outfit_by_id_or_name(outfit_id).notes = form["notes"]
        db.session.commit()
        return response
    
    return response

@app.route('/update_collection', methods=["POST"])
def update_user_collection():
    form = request.get_json()
    response = {"message": "success"}

    return response

@app.route('/delete_creation', methods=["POST"])
def delete_user_creation():
    form = request.get_json()
    response = {"message": "success"}

    if form["action"] == "delete_outfit":
        outfit = crud.get_outfit_by_id_or_name(form["outfit_name"])
        if outfit.collection_list:
            for col in outfit.collection_list:
                out_col = crud.get_collection_outfit_object(outfit.outfit_id, col.collection_id)
                db.session.delete(out_col)
                db.session.commit()


        db.session.delete(outfit)
        db.session.commit()
    elif form["action"] == "delete_collection":
        collection = crud.get_colleciton(form["collection_name"])
        if collection.outfit_list:
            for outfit in collection.outfit_list:
                out_col = crud.get_collection_outfit_object(outfit.outfit_id, collection.collection_id)
                db.session.delete(out_col)
                db.session.commit()


    return response

if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
