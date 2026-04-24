#!/usr/bin/env python3
"""
Zigurat Ediciones Oníricas — Servidor Web (Flask)
──────────────────────────────────────────────────
Desarrollo local:  python server.py
Producción:        gunicorn server:flask_app
"""

import os
import json
import re
from datetime import datetime
from flask import Flask, send_from_directory, request, jsonify, abort

# Usar ruta absoluta basada en la ubicación del archivo server.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
SUBSCRIBERS_FILE = os.path.join(BASE_DIR, "subscribers.txt")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

flask_app = Flask(__name__, static_folder=None)

# ── Debug: imprimir rutas al arrancar ─────────────────────────────────────────
print(f"  BASE_DIR:   {BASE_DIR}")
print(f"  ASSETS_DIR: {ASSETS_DIR}")
print(f"  assets exists: {os.path.isdir(ASSETS_DIR)}")
if os.path.isdir(ASSETS_DIR):
    print(f"  assets contents: {os.listdir(ASSETS_DIR)}")


# ── Página principal ──────────────────────────────────────────────────────────
@flask_app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@flask_app.before_request
def allow_facebook_bot():
    ua = request.headers.get("User-Agent", "").lower()
    if "facebookexternalhit" in ua:
        pass  # no bloquear, dejar pasar

# ── Debug route: ver qué hay en el servidor ───────────────────────────────────
@flask_app.route("/debug")
def debug():
    result = {
        "base_dir": BASE_DIR,
        "assets_dir": ASSETS_DIR,
        "assets_exists": os.path.isdir(ASSETS_DIR),
        "base_files": os.listdir(BASE_DIR) if os.path.isdir(BASE_DIR) else [],
        "assets_files": os.listdir(ASSETS_DIR) if os.path.isdir(ASSETS_DIR) else [],
    }
    return jsonify(result)

@flask_app.route("/robots.txt")
def robots():
    return send_from_directory(BASE_DIR, "robots.txt")

# ── Archivos estáticos ────────────────────────────────────────────────────────
@flask_app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory(ASSETS_DIR, filename)

@flask_app.route("/css/<path:filename>")
def css(filename):
    return send_from_directory(os.path.join(BASE_DIR, "css"), filename)

@flask_app.route("/js/<path:filename>")
def js_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "js"), filename)

@flask_app.route("/main.js")
def main_js():
    return send_from_directory(BASE_DIR, "main.js")


# ── POST /subscribe ───────────────────────────────────────────────────────────
@flask_app.route("/subscribe", methods=["POST"])
def subscribe():
    try:
        data  = request.get_json(force=True)
        email = data.get("email", "").strip().lower()

        if not EMAIL_RE.match(email):
            return jsonify(ok=False, error="Email inválido"), 400

        existing = set()
        if os.path.exists(SUBSCRIBERS_FILE):
            with open(SUBSCRIBERS_FILE, "r", encoding="utf-8") as f:
                for line in f:
                    parts = line.strip().split("\t")
                    if parts:
                        existing.add(parts[0])

        if email in existing:
            return jsonify(ok=True, new=False), 200

        with open(SUBSCRIBERS_FILE, "a", encoding="utf-8") as f:
            timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            f.write(f"{email}\t{timestamp}\n")

        print(f"  [+] Nuevo suscriptor: {email}")
        return jsonify(ok=True, new=True), 201

    except Exception as e:
        print(f"  [!] Error en /subscribe: {e}")
        return jsonify(ok=False, error="Error interno"), 500


# ── GET /subscribers (solo desarrollo) ───────────────────────────────────────
@flask_app.route("/subscribers")
def subscribers():
    if os.environ.get("RENDER") == "true":
        abort(403)
    lines = []
    if os.path.exists(SUBSCRIBERS_FILE):
        with open(SUBSCRIBERS_FILE, "r", encoding="utf-8") as f:
            lines = [l.strip() for l in f if l.strip()]
    return jsonify(total=len(lines), subscribers=lines)


# ── Desarrollo local ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    print()
    print("  ▲  ZIGURAT EDICIONES ONÍRICAS")
    print("  ─────────────────────────────────")
    print(f"  Servidor: http://localhost:{PORT}")
    print(f"  Debug:    http://localhost:{PORT}/debug")
    print("  Ctrl+C para detener")
    print()
    flask_app.run(host="0.0.0.0", port=PORT, debug=False)
