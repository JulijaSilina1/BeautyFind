from flask import Flask, render_template, jsonify, request, send_from_directory
import os
import json

app = Flask(__name__, static_folder="static", template_folder="templates")

# Пример продуктов (можно заменить на json-файл)
PRODUCTS = [
    {"id": 1, "name": "Ilgnoturīgais Tonālais X", "type": "Tonālie krēmi", "price": 25.99},
    {"id": 2, "name": "Krāsa Lūpām Velvet", "type": "Lūpu krāsas", "price": 9.99},
    {"id": 3, "name": "Mega Skropstu tuša Pro", "type": "Skropstu tušas", "price": 14.99},
]

# ---------- HTML ROUTES ----------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/products")
def products():
    return render_template("products.html", products=PRODUCTS)

@app.route("/favorites")
def favorites():
    return render_template("favorites.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")


# ---------- API ROUTES ----------
@app.route("/api/products")
def get_products():
    q = request.args.get("q", "").lower()
    results = [p for p in PRODUCTS if q in p["name"].lower() or q in p["type"].lower()]
    return jsonify(results)


# ---------- STATIC FILES ----------
@app.route("/static/<path:path>")
def send_static_files(path):
    return send_from_directory("static", path)


if __name__ == "__main__":
    app.run(debug=True)
