#!/usr/bin/env python3
"""
Zigurat Ediciones Oníricas — Servidor Web
Ejecutar con: python server.py
Luego abrir: http://localhost:8080
"""

import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"  [{self.address_string()}] {format % args}")

def open_browser():
    import time
    time.sleep(0.8)
    webbrowser.open(f"http://localhost:{PORT}")

if __name__ == "__main__":
    print()
    print("  ▲  ZIGURAT EDICIONES ONÍRICAS")
    print("  ─────────────────────────────────")
    print(f"  Servidor iniciado en http://localhost:{PORT}")
    print(f"  Directorio: {DIRECTORY}")
    print("  Presioná Ctrl+C para detener.")
    print()

    threading.Thread(target=open_browser, daemon=True).start()

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Servidor detenido.")
