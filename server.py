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
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ── Detección de entorno ──────────────────────────────────────────────────────
IS_PRODUCTION = os.environ.get("RENDER") == "true"
PORT          = int(os.environ.get("PORT", 8080))
DIRECTORY     = os.path.dirname(os.path.abspath(__file__))

GMAIL_USER     = os.environ.get("GMAIL_USER", "")
GMAIL_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

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

    # ── POST /contact ─────────────────────────────────────────────────────────
    if method == "POST" and path == "/contact":
        try:
            length = int(environ.get("CONTENT_LENGTH", 0))
            body   = environ["wsgi.input"].read(length).decode("utf-8")
            data   = json.loads(body)

            nombre  = data.get("nombre", "").strip()
            email   = data.get("email", "").strip().lower()
            mensaje = data.get("mensaje", "").strip()

            # Validaciones básicas
            if not nombre:
                return _json(start_response, 400, {"ok": False, "error": "Nombre requerido"})
            if not EMAIL_RE.match(email):
                return _json(start_response, 400, {"ok": False, "error": "Email inválido"})
            if not mensaje:
                return _json(start_response, 400, {"ok": False, "error": "Mensaje requerido"})

            # Enviar email via Gmail SMTP
            _send_email(nombre, email, mensaje)

            print(f"  [+] Nuevo contacto de: {nombre} <{email}>")
            return _json(start_response, 200, {"ok": True})

        except Exception as e:
            print(f"  [!] Error en /contact: {e}")
            return _json(start_response, 500, {"ok": False, "error": "Error al enviar el mensaje"})

    # ── Archivos estáticos ────────────────────────────────────────────────────
    return _serve_static(environ, start_response, path)


def _send_email(nombre, email_remitente, mensaje):
    """Envía el mensaje de contacto a la casilla configurada via Gmail SMTP."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Zigurat — Consulta de {nombre}"
    msg["From"]    = GMAIL_USER
    msg["To"]      = GMAIL_USER
    msg["Reply-To"] = email_remitente

    cuerpo = f"""\
Nuevo mensaje desde el sitio de Zigurat Ediciones Oníricas.

Nombre:   {nombre}
Email:    {email_remitente}

Mensaje:
{mensaje}
"""
    msg.attach(MIMEText(cuerpo, "plain", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(GMAIL_USER, GMAIL_PASSWORD)
        smtp.sendmail(GMAIL_USER, GMAIL_USER, msg.as_bytes())


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
    print("  ▲  ZIGURAT EDICIONES ONÍRICAS")
    print("  ─────────────────────────────────")
    print(f"  Servidor: http://localhost:{PORT}")
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
