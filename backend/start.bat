@echo off
echo Starting PromptCraft 3D Backend...
call "%~dp0venv\Scripts\activate.bat"
venv\Scripts\uvicorn app.main:app --reload --port 8000
