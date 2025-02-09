import whisper
import sounddevice as sd
import numpy as np
import wave
import nltk
import threading
import time
from transformers import pipeline
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from collections import defaultdict

class SmartAudioNotes:
    def __init__(self, whisper_model="small"):
        self.whisper_model = whisper.load_model(whisper_model)
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.stop_words = set(stopwords.words('english'))
        self.tokenizer = RegexpTokenizer(r'\w+')
        
        self.fs = 16000  # Sampling frequency
        self.channels = 1  # Mono audio
        self.recording = True
    
    def record_audio(self):
        print("Recording... Press ENTER to stop.")
        audio_data = []

        def stop_recording():
            input()
            self.recording = False
        
        stop_thread = threading.Thread(target=stop_recording)
        stop_thread.start()
        
        with sd.InputStream(channels=self.channels, 
                          samplerate=self.fs, 
                          dtype='int16', 
                          callback=lambda indata, frames, time, status: audio_data.append(indata.copy())):
            while self.recording:
                time.sleep(0.1)

        audio_data = np.concatenate(audio_data, axis=0)
        filename = 'user_recording.wav'
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(self.channels)
            wf.setsampwidth(2)
            wf.setframerate(self.fs)
            wf.writeframes(audio_data.tobytes())
        
        print(f"Recording saved as {filename}")
        return filename

    def transcribe_audio(self, audio_file):
        result = self.whisper_model.transcribe(audio_file)
        return result["text"]

    def generate_summary(self, text):
        if len(text.split()) < 50:
            return text  # If text is short, return as is
        
        summary = self.summarizer(text, max_length=100, min_length=50, do_sample=False)
        return summary[0]['summary_text']

    def extract_key_terms(self, text, num_terms=10):
        words = self.tokenizer.tokenize(text.lower())
        words = [w for w in words if w not in self.stop_words]
        fdist = FreqDist(words)
        return fdist.most_common(num_terms)

    def generate_bullet_points(self, text, num_points=5):
        sentences = nltk.sent_tokenize(text)
        return sentences[:num_points]

    def process_recording(self):
        audio_file = self.record_audio()
        print("\nTranscribing audio...")
        transcription = self.transcribe_audio(audio_file)
        print("\nTranscription:", transcription)
        
        print("\nGenerating smart notes...")
        notes = {
            'summary': self.generate_summary(transcription),
            'important_terms': self.extract_key_terms(transcription),
            'bullet_points': self.generate_bullet_points(transcription)
        }
        
        return self.format_notes(notes, transcription)
    
    def format_notes(self, notes, transcription):
        output = "\U0001F4DD  NOTES\n" + "="*50 + "\n\n"
        
        output += "\U0001F4CC FULL TRANSCRIPTION:\n"
        output += f"{transcription}\n\n"
        
        output += "\U0001F4DD SUMMARY:\n"
        output += f"{notes['summary']}\n\n"
        
        output += "\U0001F511 IMPORTANT TERMS:\n"
        for term, freq in notes['important_terms']:
            output += f"• {term} (mentioned {freq} times)\n"
        
        output += "\n\U0001F4CB STRUCTURED BULLET POINTS:\n"
        for bullet in notes['bullet_points']:
            output += f"• {bullet}\n"
        
        return output

# Usage example
def main():
    nltk.download('punkt')
    nltk.download('stopwords')
    
    note_taker = SmartAudioNotes(whisper_model="small")
    notes = note_taker.process_recording()
    print(notes)
    
    with open("smart_notes.txt", "w", encoding="utf-8") as f:
        f.write(notes)

if __name__ == "__main__":
    main()