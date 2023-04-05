from flask import Flask, render_template, jsonify, request


app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")