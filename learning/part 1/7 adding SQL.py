from flask import Flask, render_template, redirect, url_for, request, session, flash
from datetime import timedelta
import sqlite3

app = Flask(__name__)
app.secret_key = "cat"

app.permanent_session_lifetime = timedelta(minutes=5)

db_path = "users.sqlite3"


def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # lets you access columns by name, like row["email"]
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users 
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            email TEXT)
    """)
    conn.commit()
    conn.close()
init_db()




@app.route('/')
def home():
    return render_template("3 child_template.html")


@app.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        session.permanent = True
        user = request.form["nm"]
        session["user"] = user
        conn = get_db_connection()
        existing = conn.execute("SELECT * FROM users WHERE name = ?", (user,)).fetchone()
        #.fetchone() is you getting one row.
        #.fetchall() is you getting all matching results

        if existing is None:
            conn.execute("INSERT INTO users (name) VALUES (?)", (user,))
            conn.commit()
        conn.close()

        flash("Login successful.")
        return redirect(url_for("user"))
    else:
        if "user" in session:
            flash("Already logged in.")
            return redirect(url_for("user"))
        return render_template("6 login_with_flashing.html")

@app.route("/user", methods=["POST", "GET"])
def user():
    email = None
    if "user" in session:
        user = session["user"]
        if request.method == "POST":
            email = request.form["email"]
            session["email"] = email
            flash("Email was saved!")
        else:
            if "email" in session:
                email = session["email"]
        return render_template("7 user_sql.html", email=email, user=user)
    else:
        flash("You are not logged in!")
        return redirect(url_for('login'))

@app.route("/logout")
def logout():
    user = session["user"]
    flash(f'{user} have been loged out.', "info")
    session.pop("user", None)
    session.pop("email", None)
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)

