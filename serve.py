#!/usr/bin/env python3
"""Minimal static server for the AURUM landing page (no build step)."""
import os
import http.server
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
PORT = 4321


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"AURUM landing served from {ROOT} on :{PORT}")
    httpd.serve_forever()
