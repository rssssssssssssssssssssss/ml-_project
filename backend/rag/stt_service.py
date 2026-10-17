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

    def transcribe(self, audio_bytes: bytes, language: str = None) -> dict:
        """
        Transcribes audio bytes into text.
        If language is specified (e.g. 'telugu', 'tamil', 'hindi', 'kannada', 'english'),
        Whisper forces decoding in that language without misidentifying it.
        """
        try:
            audio_data, sample_rate = sf.read(io.BytesIO(audio_bytes))
        except Exception:
            audio_data, sample_rate = librosa.load(io.BytesIO(audio_bytes), sr=16000)

        # Mono conversion
        if hasattr(audio_data, "ndim") and audio_data.ndim > 1:
            audio_data = audio_data.mean(axis=1)

        # Resample to 16kHz
        if sample_rate != 16000:
            audio_data = librosa.resample(audio_data, orig_sr=sample_rate, target_sr=16000)
            sample_rate = 16000

        generate_kwargs = {
            "task": "transcribe"
        }

        # If language is provided (and not 'auto'), explicitly guide Whisper
        if language and language.lower() not in ["auto", "all", ""]:
            lang_clean = language.lower().strip()
            generate_kwargs["language"] = lang_clean

        result = self.pipe(
            audio_data,
            return_timestamps=False,
            generate_kwargs=generate_kwargs
        )

        text = result.get("text", "").strip()
        return {
            "success": True,
            "text": text
        }
