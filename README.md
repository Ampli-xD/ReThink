# ReThink - Cross-Device Markdown Notes App

A simple and elegant markdown notes application that works across all your devices.

## Features
- Create and edit markdown notes
- Automatic preview of markdown formatting
- Cross-device synchronization using cloud storage
- Offline access to your notes
- Clean and modern UI

## Setup
1. Install Python 3.8 or higher
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python app.py
   ```
4. Open your browser and navigate to `http://localhost:5000`

## Synchronization
The app stores its database in a SQLite file. To enable cross-device sync:
1. Move the `notes.db` file to your cloud storage folder (Dropbox/Google Drive)
2. Update the database path in `.env` file to point to the synced location
