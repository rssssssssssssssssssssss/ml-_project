import io
import torch
import soundfile as sf
import librosa
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

MODEL_ID = "openai/whisper-small"

class WhisperSTTService:
    def __init__(self):
        print("Initializing Whisper STT Service (openai/whisper-small)...")
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.dtype = torch.float16 if torch.cuda.is_available() else torch.float32

        self.model = AutoModelForSpeechSeq2Seq.from_pretrained(
            MODEL_ID,
            dtype=self.dtype,
            low_cpu_mem_usage=True,
            use_safetensors=True
        )
        self.model.to(self.device)

        self.processor = AutoProcessor.from_pretrained(MODEL_ID)

        self.pipe = pipeline(
            "automatic-speech-recognition",
            model=self.model,
            tokenizer=self.processor.tokenizer,
            feature_extractor=self.processor.feature_extractor,
            dtype=self.dtype,
            device=self.device,
        )
        print(f"Whisper STT Service ready on {self.device}!")

    def transcribe(self, audio_bytes: bytes) -> dict:
        """
        Transcribes audio bytes (e.g. webm, wav, ogg, mp3) into text.
        Supports any native language supported by Whisper (Hindi, Tamil, Telugu, English, etc.)
        """
        # Load audio using soundfile or fallback to librosa
        try:
            audio_data, sample_rate = sf.read(io.BytesIO(audio_bytes))
        except Exception:
            # Fallback with librosa
            audio_data, sample_rate = librosa.load(io.BytesIO(audio_bytes), sr=16000)

        # If multi-channel, convert to mono
        if hasattr(audio_data, "ndim") and audio_data.ndim > 1:
            audio_data = audio_data.mean(axis=1)

        # Resample to 16kHz if not already
        if sample_rate != 16000:
            audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=16000)
            sample_rate = 16000

        # Generate transcription
        # Whisper automatically detects the spoken language
        result = self.pipe(
            audio_data,
            return_timestamps=False,
            generate_kwargs={"task": "transcribe"}
        )

        text = result.get("text", "").strip()
        return {
            "success": True,
            "text": text
        }
