from flask import Flask, render_template

app = Flask(__name__)


@app.route('/') #or ("/home") will work the same. this is to access this specific page using url.
def home():
    return render_template("3 child_template.html")


if __name__ == "__main__":
    app.run(debug=True)



# !!! those <link> and <script> just allow for customization (bootstraping) like CSS n shi!!!


# in child template:
# either {% extends "3 base_template.html" %}
# or
# {% extends "folder/3 base_template.html" %}


# <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">User</a>