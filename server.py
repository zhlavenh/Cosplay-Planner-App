from flask import Flask, render_template, jsonify, request
import requests
from model import connect_to_db, db
import crud

app = Flask(__name__)

@app.route('/')
def show_homepage():

    return render_template("homepage.html")

@app.route('/disp_all_anime')
def disp_all_anime():
    url, query, variables = crud.get_all_anime()
    response = requests.post(url, json={'query': query, 'variables': variables})
    return response.json()

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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")