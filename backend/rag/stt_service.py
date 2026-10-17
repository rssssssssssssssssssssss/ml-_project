import io
import sys
import torch
import soundfile as sf
import librosa
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

MODEL_ID = "openai/whisper-small"

# Language ISO map
LANGUAGE_MAP = {
    "telugu": "te",
    "te": "te",
    "tamil": "ta",
    "ta": "ta",
    "kannada": "kn",
    "kn": "kn",
    "malayalam": "ml",
    "ml": "ml",
    "hindi": "hi",
    "hi": "hi",
    "bengali": "bn",
    "bn": "bn",
    "marathi": "mr",
    "mr": "mr",
    "gujarati": "gu",
    "gu": "gu",
    "english": "en",
    "en": "en",
}

class WhisperSTTService:
    def __init__(self):
        print("Initializing Optimized Whisper STT Service (openai/whisper-small)...")
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

    def transcribe(self, audio_bytes: bytes, language: str = None) -> dict:
        """
        Transcribes audio bytes into text with high-accuracy native language decoding.
        """
        try:
            audio_data, sample_rate = sf.read(io.BytesIO(audio_bytes))
        except Exception:
            audio_data, sample_rate = librosa.load(io.BytesIO(audio_bytes), sr=16000)

        # Convert to mono if multi-channel
        if hasattr(audio_data, "ndim") and audio_data.ndim > 1:
            audio_data = audio_data.mean(axis=1)

        # Resample to 16kHz
        if sample_rate != 16000:
            audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=16000)

        generate_kwargs = {
            "task": "transcribe",
            "num_beams": 3,
            "repetition_penalty": 1.2,
        }

        # Resolve language code
        target_lang = None
        if language:
            lang_clean = language.lower().strip()
            target_lang = LANGUAGE_MAP.get(lang_clean, lang_clean)

        if target_lang and target_lang not in ["auto", "all", ""]:
            # Set exact ISO language code (e.g. 'te' for Telugu)
            generate_kwargs["language"] = target_lang

        result = self.pipe(
            audio_data,
            return_timestamps=False,
            generate_kwargs=generate_kwargs
        )

        text = result.get("text", "").strip()

        # Safely log without Windows charmap encoding crash on Telugu/Tamil/Kannada characters
        try:
            print(f"[STT Transcription] target_lang={target_lang} -> '{text}'")
        except Exception:
            pass

        return {
            "success": True,
            "text": text,
            "language": target_lang
        }
