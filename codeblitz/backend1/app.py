from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import threading
from Code import SmartAudioNotes  # Import your SmartAudioNotes class

app = Flask(__name__)

# MongoDB Setup
client = MongoClient("mongodb://localhost:27017/")
db = client["audio_notes_db"]
collection = db["notes"]

# Global instance of your SmartAudioNotes class
note_taker = SmartAudioNotes(whisper_model="small")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_recording', methods=['GET'])
def start_recording():
    """Handle the start recording request"""
    def record_and_process():
        notes = note_taker.process_recording()

        # Save the generated notes to MongoDB
        collection.insert_one({"notes": notes, "status": "completed"})

    # Run the recording and processing in a separate thread to avoid blocking
    thread = threading.Thread(target=record_and_process)
    thread.start()

    return jsonify({"status": "Recording started"})

@app.route('/get_notes', methods=['GET'])
def get_notes():
    """Fetch the latest generated notes from MongoDB"""
    try:
        # Get the latest notes from MongoDB
        latest_note = collection.find_one(sort=[('_id', -1)])  # Sort by the latest document
        if latest_note:
            return jsonify({"notes": latest_note['notes']})
        else:
            return jsonify({"error": "No notes found"})
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)