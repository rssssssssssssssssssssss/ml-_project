import io
import torch
import soundfile as sf
import librosa
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

MODEL_ID = "openai/whisper-small"

# Language ISO map and regional prompt biases to guide decoding into native scripts
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

# Initial prompts conditioning Whisper decoder to use native script instead of transliterating/hallucinating Hindi
INITIAL_PROMPTS = {
    "te": "బ్యాంకు, ఖాతా, రుణం, వ్యక్తిగత రుణం, గృహ రుణం, వేదాంత బ్యాంకు.",
    "ta": "வங்கி, கணக்கு, கடன், தனிநபர் கடன், வீட்டுக் கடன், வேதாந்தா வங்கி.",
    "kn": "ಬ್ಯಾಂಕ್, ಖಾತೆ, ಸಾಲ, ವೈಯಕ್ತಿಕ ಸಾಲ, ಗೃಹ ಸಾಲ, ವೇದಾಂತ ಬ್ಯಾಂಕ್.",
    "ml": "ബാങ്ക്, അക്കൗണ്ട്, വായ്പ, ഭവന വായ്പ, വേദാന്ത ബാങ്ക്.",
    "hi": "बैंक, खाता, ऋण, व्यक्तिगत ऋण, गृह ऋण, वेदांता बैंक.",
    "en": "Bank, account, loan, personal loan, home loan, Vedranta Bank.",
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
            # Set exact language code (e.g. 'te' for Telugu)
            generate_kwargs["language"] = target_lang

            # Provide initial prompt in the target script to lock the language script
            if target_lang in INITIAL_PROMPTS:
                generate_kwargs["initial_prompt"] = INITIAL_PROMPTS[target_lang]

        result = self.pipe(
            audio_data,
            return_timestamps=False,
            generate_kwargs=generate_kwargs
        )

        text = result.get("text", "").strip()
        print(f"[STT Transcription] target_lang={target_lang} -> '{text}'")

        return {
            "success": True,
            "text": text,
            "language": target_lang
        }
