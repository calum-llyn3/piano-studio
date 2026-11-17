#!/usr/bin/env python3
"""Touch-friendly iPad Lectern Server for Piano Studio.
Serves the interactive iPad web app over local Wi-Fi and saves bench check-ins back to LESSON_LOG.md.
"""

from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import socket

STUDIO_DIR = Path(__file__).parent.resolve()
LESSON_LOG = STUDIO_DIR / "LESSON_LOG.md"
PORT = 8765


def get_lan_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


class PianoStudioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STUDIO_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()

    def do_POST(self):
        if self.path == "/api/log":
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8", errors="replace")
            try:
                payload = json.loads(raw)
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
                bpm = payload.get("bpm", "66")
                completed = payload.get("completed", [])
                notes = payload.get("notes", "").strip()

                entry_lines = [
                    f"\n## iPad Lectern Check-In ({timestamp})",
                    f"- **Achieved Tempo:** {bpm} BPM",
                ]
                if completed:
                    entry_lines.append(f"- **Completed on Bench:** {', '.join(completed)}")
                if notes:
                    entry_lines.append(f"- **Student Notes from Bench:** {notes}")

                with LESSON_LOG.open("a", encoding="utf-8") as f:
                    f.write("\n".join(entry_lines) + "\n")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": True, "timestamp": timestamp}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == "__main__":
    os.chdir(STUDIO_DIR)
    hostname = socket.gethostname()
    lan_ip = get_lan_ip()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), PianoStudioHandler)
    print(f"Piano Studio iPad Server running on port {PORT}")
    print(f"  iPad URL (IP):       http://{lan_ip}:{PORT}")
    print(f"  iPad URL (Hostname): http://{hostname}:{PORT}")
    server.serve_forever()
