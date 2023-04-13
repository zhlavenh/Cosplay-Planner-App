from flask import Flask, render_template, flash, request, session, redirect
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

# @app.route('/user_account')
# def nav_user_acct():
#     return render_template("account.html")

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

    url, query, variables = crud.api_find_character(inputName["name"])
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

#Sessions handling
@app.route('/handle_login', methods=['POST'])
def handle_login():
    """Log in user"""
    form = request.get_json()
    formType = form["formType"]
    response = {"message": False, "status": False, "user_name": ""}
        
    if 'user_name' not in session["user_info"]:

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
                session["user_info"]["user_password"] = user.user_password
                session["user_info"]["email"] = user.email
                session.modified = True

            elif response["message"] == False:
                response["message"] = "There was an error in creating your account"

        return response
    else:
        return response

if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
