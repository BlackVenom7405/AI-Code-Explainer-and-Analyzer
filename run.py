import os
import sys
import time
import shutil
import signal
import threading
import subprocess
import webbrowser
import urllib.request

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

processes = []

def kill_process_tree(proc):
    if proc and proc.poll() is None:
        try:
            if sys.platform == "win32":
                subprocess.run(
                    f"taskkill /F /T /PID {proc.pid}",
                    shell=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
            else:
                proc.terminate()
                proc.wait(timeout=3)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass

def shutdown_handler(signum=None, frame=None):
    print("\n\n[CodeLens AI] Shutting down servers gracefully...")
    for p in processes:
        kill_process_tree(p)
    print("[CodeLens AI] All servers stopped. Goodbye!")
    sys.exit(0)

def stream_logs(pipe, prefix):
    try:
        for line in iter(pipe.readline, ''):
            if not line:
                break
            line_str = line.strip()
            if line_str:
                print(f"[{prefix}] {line_str}", flush=True)
    except Exception:
        pass

def wait_for_service(url, timeout=20):
    start = time.time()
    while time.time() - start < timeout:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "CodeLens-Runner"})
            with urllib.request.urlopen(req, timeout=1.5) as response:
                if response.status in (200, 304):
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def check_dependencies():
    print("[CodeLens AI] Checking prerequisites...")
    
    # 1. Check Python version
    if sys.version_info < (3, 9):
        print("[Error] Python 3.9+ is required.")
        sys.exit(1)

    # 2. Check Node / npm
    npm_bin = shutil.which("npm") or shutil.which("npm.cmd")
    if not npm_bin:
        print("[Error] 'npm' was not found in PATH. Please install Node.js (https://nodejs.org).")
        sys.exit(1)

    # 3. Setup backend .env if not exists
    backend_env = os.path.join(BACKEND_DIR, ".env")
    backend_env_example = os.path.join(BACKEND_DIR, ".env.example")
    if not os.path.exists(backend_env) and os.path.exists(backend_env_example):
        shutil.copy(backend_env_example, backend_env)
        print("[Setup] Created backend/.env from .env.example")

    # 4. Check frontend node_modules
    frontend_node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(frontend_node_modules):
        print("[Setup] Installing frontend dependencies (npm install)... This may take a moment.")
        subprocess.run([npm_bin, "install"], cwd=FRONTEND_DIR, check=True, shell=True)

    return npm_bin

def main():
    signal.signal(signal.SIGINT, shutdown_handler)
    signal.signal(signal.SIGTERM, shutdown_handler)

    print("=" * 62)
    print("         >>> STARTING CODELENS AI (FULL-STACK APP) <<<        ")
    print("=" * 62)

    npm_bin = check_dependencies()

    # 1. Start Backend
    print("[CodeLens AI] Starting FastAPI backend on http://127.0.0.1:8000 ...")
    backend_cmd = [
        sys.executable, "-m", "uvicorn", "app.main:app",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--reload"
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    processes.append(backend_proc)

    t_backend = threading.Thread(target=stream_logs, args=(backend_proc.stdout, "Backend"), daemon=True)
    t_backend.start()

    # 2. Start Frontend
    print("[CodeLens AI] Starting Vite frontend on http://localhost:5173 ...")
    frontend_cmd = [npm_bin, "run", "dev"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        shell=(sys.platform == "win32")
    )
    processes.append(frontend_proc)

    t_frontend = threading.Thread(target=stream_logs, args=(frontend_proc.stdout, "Frontend"), daemon=True)
    t_frontend.start()

    # Wait for services to be ready
    print("[CodeLens AI] Waiting for servers to initialize...")
    backend_ready = wait_for_service("http://127.0.0.1:8000/api/health", timeout=15)
    frontend_ready = wait_for_service("http://localhost:5173", timeout=15)

    print("\n" + "=" * 62)
    print("  [OK] CodeLens AI is LIVE and ready!")
    print("  -->  Frontend UI : http://localhost:5173")
    print("  -->  Backend API : http://127.0.0.1:8000")
    print("  -->  API Docs    : http://127.0.0.1:8000/docs")
    print("  -->  Press Ctrl+C anytime to stop both servers.")
    print("=" * 62 + "\n")

    # Automatically open browser
    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    # Keep script alive and monitor child processes
    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print(f"[Error] Backend process terminated unexpectedly with code {backend_proc.returncode}")
                break
            if frontend_proc.poll() is not None:
                print(f"[Error] Frontend process terminated unexpectedly with code {frontend_proc.returncode}")
                break
    except KeyboardInterrupt:
        pass
    finally:
        shutdown_handler()

if __name__ == "__main__":
    main()
