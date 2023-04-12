from flask import Flask, render_template, flash, request, session, redirect
import requests
from model import connect_to_db, db, User, Collection, Outfit, Character, Shop, Item, Show
import crud
import os

app = Flask(__name__)
app.secret_key = os.environ['secret_key']

# Display Webpages
@app.route('/')
def show_homepage():
    return render_template("homepage.html")

@app.route('/user_account')
def nav_user_acct():
    return render_template("account.html")

@app.route('/user_collections')
def nav_user_collections():
    return render_template("collections.html")

@app.route('/user_outfits')
def nav_user_outfits():
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

@app.route('/create')
def nav_create_page():
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

    url, query, variables = crud.api_find_character(inputName["name"])
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

#Sessions handling
@app.route('/handle_login', methods=['POST'])
def handle_login():
    """Log in user"""
    formInputs = request.get_json()
    formType = formInputs["formType"]
    user_name = formInputs["user_name"]
    password = formInputs["password"]
    response = {"message": ""}
    if user_name == None:
        response["message"] = "You haven't entered anything yet"
        return response
    elif formType == "Login":
        response["message"] = crud.get_user_info(user_name, password)
        return response



if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
