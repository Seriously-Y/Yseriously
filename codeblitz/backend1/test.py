import whisper
import sounddevice as sd
import numpy as np
import wave
import sys
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)



model = whisper.load_model("small")

# Set parameters for the recording
fs = 16000  # Sampling frequency
channels = 1  # Mono audio
recording = True  # Global flag to control recording

# Function to record audio and save it to a WAV file
def record_audio():
    global recording
    print("🎤 Recording... Press 'Enter' to stop.")

    audio_data = []

    def stop_listener():
        """ Wait for Enter key press to stop recording """
        input()  # Wait for user to press Enter
        global recording
        recording = False

    # Start a separate thread to listen for the Enter key
    stop_thread = threading.Thread(target=stop_listener)
    stop_thread.start()

    # Start recording
    with sd.InputStream(channels=channels, samplerate=fs, dtype='int16') as stream:
        while recording:
            data, _ = stream.read(1024)
            audio_data.append(data.copy())

    # Stop the thread
    stop_thread.join()

    # Convert recorded data into a NumPy array
    audio_data = np.concatenate(audio_data, axis=0)

    # Save the audio data to a WAV file
    filename = 'user_recording.wav'
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)  # 16-bit audio
        wf.setframerate(fs)
        wf.writeframes(audio_data.tobytes())

    print(f"✅ Recording saved as {filename}")
    return filename

# Record audio and save to a file
audio_file = record_audio()

# Transcribe the saved audio file using Whisper
print("📝 Transcribing...")
result = model.transcribe(audio_file)

# Print the transcription
print("\n🔊 Transcription:")
print(result["text"] if result["text"] else "No speech detected.")

from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
    return summary[0]['summary_text']

notes = summarize_text(result["text"])
print("Generated Notes:", notes)


import openai

client = openai.OpenAI(api_key="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")

response = client.chat.completions.create(
    model="gpt-3.5-turbo", 
    messages=[
        {"role": "system", "content": "Summarize the following text into bullet points:"},
        {"role": "user", "content": result["text"]}
    ]
)

print(response.choices[0].message.content)  














