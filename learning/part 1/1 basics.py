from flask import Flask, redirect, url_for

app = Flask(__name__)

admin_right = False


@app.route('/') #or ("/home") will work the same. this is to access this specific page using url.
def home():
    return "This is the homepage. <h1>HELLO<h1>"


@app.route('/<name>')
def user(name):
    return f"Hello {name}"
    #so whatever you type in the url after the / will be passed into name variable. same as for example users ID work. e.g. in rb.


@app.route('/admin/')
def admin():
    if not admin_right:
        return redirect(url_for('user', name = "Admin!"))
    else:
        return redirect(url_for('home'))

if __name__ == "__main__":
    app.run()