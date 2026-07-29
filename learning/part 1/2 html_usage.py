from flask import Flask, render_template

app = Flask(__name__)


@app.route('/') #or ("/home") will work the same. this is to access this specific page using url.
def home():
    return render_template("test_basics.html")

@app.route('/<name>')
def user(name):
    return render_template('test_basics.html', content = name, idk = "random text xd")

@app.route('/namelist')
def ListOfNames():
    return render_template('test_lists.html', names = ['aboba', 'clown', 'urmom', 'idk'])

if __name__ == "__main__":
    app.run()



#for html:

# {{statement}} - statement is seen as a variable
# {%statement%} - statement is seen as a piece of "python" code
# statement - this is the text that is being printed out