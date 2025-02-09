
import speech_recognition as sr

recognizer = sr.Recognizer()
with sr.Microphone() as source:
    print("Recording...")
    recognizer.adjust_for_ambient_noise(source)
    audio = recognizer.listen(source)


response = {
    "success": True,
    "error": None,
    "transcription": None
}
try:
    text = recognizer.recognize_google(audio)
    print("You said:", text)
except sr.UnknownValueError:
    response["success"] = False
    response["error"] = "API unavailable"
except sr.RequestError:
    print("Could not request results")

import time
import json
import pyaudio
import os
from vosk import Model, KaldiRecognizer

# Set the correct model path
model_path = "vosk-model-en-us-0.22-lgraph"  # Update with the correct path
if not os.path.exists(model_path):
    raise Exception(f"Model not found at {model_path}")

model = Model(model_path)

# Initialize the recognizer
recognizer = KaldiRecognizer(model, 16000)

# Get the correct microphone index
mic_index = 0  # Change this after checking your mic index

# Initialize PyAudio with the correct microphone
p = pyaudio.PyAudio()

try:
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, 
                    input=True, frames_per_buffer=8000, input_device_index=mic_index)
    stream.start_stream()
except OSError:
    print("Could not access microphone. Check if the device index is correct.")
    p.terminate()
    exit()

print("Listening... Speak into the laptop microphone (Recording will stop after 10 seconds)")

# Set the recording duration
start_time = time.time()
record_duration = 10  # Stop after 10 seconds

final_text = ""

while True:
    data = stream.read(4000, exception_on_overflow=False)
    
    if recognizer.AcceptWaveform(data):
        result = json.loads(recognizer.Result())
        if "text" in result:
            final_text += result["text"] + " "

    # Stop after 10 seconds
    if time.time() - start_time > record_duration:
        print("🛑 Time limit reached. Stopping recording.")
        break

# Close the audio stream
stream.stop_stream()
stream.close()
p.terminate()

print("\n🔊 Final Transcription:")
print(final_text if final_text else "No speech detected.")





