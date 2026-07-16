import speech_recognition as sr
import sys

def transcribe(wav_path, lang_code):
    r = sr.Recognizer()
    try:
        with sr.AudioFile(wav_path) as source:
            audio = r.record(source)
        text = r.recognize_google(audio, language=lang_code)
        print(text)
    except sr.UnknownValueError:
        print("") # Empty transcript on silence
    except Exception as e:
        print(f"Transcription error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python transcribe.py <wav_path> <lang_code>", file=sys.stderr)
        sys.exit(1)
    transcribe(sys.argv[1], sys.argv[2])
