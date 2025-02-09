const recorder = require("node-record-lpcm16");
const fs = require("fs");
const whisper = require("whisper-openai"); // OpenAI Whisper API
const natural = require("natural");
const summarizer = require("summarizer");

// Configuration
const AUDIO_FILE = "uploads/user_recording.wav";
const RECORD_DURATION = 10; // Record for 10 seconds
const API_KEY = process.env.OPENAI_API_KEY; // Store your OpenAI API key in .env

// Record Audio
function recordAudio() {
  return new Promise((resolve, reject) => {
    console.log("🎙 Recording... Press Ctrl+C to stop.");

    const file = fs.createWriteStream(AUDIO_FILE, { encoding: "binary" });
    const recording = recorder.record({ sampleRate: 16000 });

    recording.stream().pipe(file);

    setTimeout(() => {
      recording.stop();
      console.log("✅ Recording saved!");
      resolve(AUDIO_FILE);
    }, RECORD_DURATION * 1000);
  });
}

// Transcribe Audio using Whisper
async function transcribeAudio(audioFile) {
  console.log("🔍 Transcribing audio...");
  const result = await whisper.transcribe(audioFile, { model: "small", apiKey: API_KEY });
  return result.text;
}

// Generate Summary
function generateSummary(text) {
  return summarizer(text, 3); // Generate a 3-sentence summary
}

// Extract Key Terms
function extractKeyTerms(text, numTerms = 10) {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text.toLowerCase());

  const wordFreq = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numTerms)
    .map(([word, freq]) => ({ word, freq }));
}

// Generate Bullet Points
function generateBulletPoints(text, numPoints = 5) {
  return text.split(".").slice(0, numPoints).map((sentence) => `• ${sentence.trim()}`);
}

// Process Audio
async function processAudio() {
  const audioFile = await recordAudio();
  const transcription = await transcribeAudio(audioFile);

  console.log("\n📜 Transcription:", transcription);

  const notes = {
    summary: generateSummary(transcription),
    important_terms: extractKeyTerms(transcription),
    bullet_points: generateBulletPoints(transcription),
  };

  return notes;
}

module.exports = { processAudio };