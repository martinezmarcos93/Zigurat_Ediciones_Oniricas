#!/usr/bin/env python3
"""
Zigurat Ediciones Oníricas — Servidor Web
─────────────────────────────────────────
Desarrollo local:  python server.py
Producción:        gunicorn server:app   (Render lo llama automáticamente)
"""

import os
import json
import re
from datetime import datetime

# ── Detección de entorno ──────────────────────────────────────────────────────
IS_PRODUCTION = os.environ.get("RENDER") == "true"
PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
SUBSCRIBERS_FILE = os.path.join(DIRECTORY, "subscribers.txt")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ── App WSGI (compatible con gunicorn para Render) ────────────────────────────
def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET")
    path   = environ.get("PATH_INFO", "/")

    # CORS preflight
    if method == "OPTIONS":
        start_response("204 No Content", [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "POST, GET, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type"),
        ])
        return [b""]

    # ── POST /subscribe ───────────────────────────────────────────────────────
    if method == "POST" and path == "/subscribe":
        try:
            length = int(environ.get("CONTENT_LENGTH", 0))
            body   = environ["wsgi.input"].read(length).decode("utf-8")
            data   = json.loads(body)
            email  = data.get("email", "").strip().lower()

            if not EMAIL_RE.match(email):
                return _json(start_response, 400, {"ok": False, "error": "Email inválido"})

            # Verificar si ya existe
            existing = set()
            if os.path.exists(SUBSCRIBERS_FILE):
                with open(SUBSCRIBERS_FILE, "r", encoding="utf-8") as f:
                    for line in f:
                        parts = line.strip().split("\t")
                        if parts:
                            existing.add(parts[0])

            if email in existing:
                return _json(start_response, 200, {"ok": True, "new": False})

            # Guardar nuevo suscriptor
            with open(SUBSCRIBERS_FILE, "a", encoding="utf-8") as f:
                timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
                f.write(f"{email}\t{timestamp}\n")

            print(f"  [+] Nuevo suscriptor: {email}")
            return _json(start_response, 201, {"ok": True, "new": True})

        except Exception as e:
            print(f"  [!] Error en /subscribe: {e}")
            return _json(start_response, 500, {"ok": False, "error": "Error interno"})

    # ── GET /subscribers (solo en desarrollo, para ver la lista) ─────────────
    if method == "GET" and path == "/subscribers" and not IS_PRODUCTION:
        if os.path.exists(SUBSCRIBERS_FILE):
            with open(SUBSCRIBERS_FILE, "r", encoding="utf-8") as f:
                lines = [l.strip() for l in f if l.strip()]
        else:
            lines = []
        return _json(start_response, 200, {"total": len(lines), "subscribers": lines})

    # ── Archivos estáticos ────────────────────────────────────────────────────
    return _serve_static(environ, start_response, path)


def _json(start_response, status_code, data):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    status_map = {
        200: "200 OK",
        201: "201 Created",
        400: "400 Bad Request",
        500: "500 Internal Server Error",
    }
    headers = [
        ("Content-Type", "application/json; charset=utf-8"),
        ("Content-Length", str(len(body))),
        ("Access-Control-Allow-Origin", "*"),
    ]
    start_response(status_map.get(status_code, "200 OK"), headers)
    return [body]


def _serve_static(environ, start_response, path):
    import mimetypes
    if path in ("/", ""):
        path = "/index.html"

    filepath = os.path.join(DIRECTORY, path.lstrip("/"))

    # Seguridad: no salir del directorio raíz
    if not os.path.abspath(filepath).startswith(os.path.abspath(DIRECTORY)):
        start_response("403 Forbidden", [("Content-Type", "text/plain")])
        return [b"Forbidden"]

    if not os.path.isfile(filepath):
        fallback = os.path.join(DIRECTORY, "index.html")
        if os.path.isfile(fallback):
            filepath = fallback
        else:
            start_response("404 Not Found", [("Content-Type", "text/plain")])
            return [b"Not found"]

    mime, _ = mimetypes.guess_type(filepath)
    mime = mime or "application/octet-stream"

    with open(filepath, "rb") as f:
        body = f.read()

    start_response("200 OK", [
        ("Content-Type", mime),
        ("Content-Length", str(len(body))),
    ])
    return [body]


# ── Servidor de desarrollo local ──────────────────────────────────────────────
if __name__ == "__main__":
    import threading
    import webbrowser
    from wsgiref.simple_server import make_server

    print()
    print("  ▲  ZIGURAT EDICIONES ONICAS")
    print("  ─────────────────────────────────")
    print(f"  Servidor: http://localhost:{PORT}")
    print(f"  Ver suscriptores: http://localhost:{PORT}/subscribers")
    print("  Ctrl+C para detener")
    print()

    def _open():
        import time
        time.sleep(0.8)
        webbrowser.open(f"http://localhost:{PORT}")

    threading.Thread(target=_open, daemon=True).start()

    with make_server("", PORT, app) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Servidor detenido.")
