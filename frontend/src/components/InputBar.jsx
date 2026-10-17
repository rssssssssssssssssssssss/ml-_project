import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import API from "../services/api";

function InputBar({ setMessages, loading, setLoading }) {
    const [input, setInput] = useState("");
    const [recording, setRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    async function sendMessage(textToSend) {
        const queryText = (textToSend !== undefined ? textToSend : input).trim();
        if (!queryText || loading || transcribing) return;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: queryText,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await API.post("/chat", {
                sessionId: "user1",
                message: queryText,
            });

            setMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: response.data.reply,
                },
            ]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: "Something went wrong while contacting the server.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    async function startRecording() {
        if (loading || transcribing) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorder.mimeType || "audio/webm";
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                stream.getTracks().forEach(track => track.stop());

                if (audioBlob.size > 0) {
                    await sendAudioForTranscription(audioBlob);
                }
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Could not access microphone. Please check browser microphone permissions.");
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    }

    async function sendAudioForTranscription(audioBlob) {
        setTranscribing(true);
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "user_speech.webm");

            const response = await API.post("/chat/transcribe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.success && response.data.text) {
                const transcribedText = response.data.text.trim();
                if (transcribedText) {
                    // Send query automatically
                    await sendMessage(transcribedText);
                }
            } else {
                alert("Could not understand audio. Please speak clearly and try again.");
            }
        } catch (err) {
            console.error("Transcription error:", err);
            alert("Error transcribing speech. Please try again.");
        } finally {
            setTranscribing(false);
        }
    }

    const isBusy = loading || transcribing;

    return (
        <div className="bg-white border-t">
            <div className="max-w-5xl mx-auto p-4 flex gap-3 items-center">
                <input
                    type="text"
                    value={input}
                    disabled={isBusy || recording}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder={
                        recording
                            ? "Listening to your voice... Speak in any language..."
                            : transcribing
                            ? "Transcribing your speech with Whisper STT..."
                            : "Ask Vedranta Bank anything (or click the mic to speak in any language)..."
                    }
                    className={`flex-1 border rounded-lg px-4 py-3 outline-none transition ${
                        recording
                            ? "border-red-500 bg-red-50 ring-2 ring-red-400 placeholder-red-600 font-medium"
                            : "focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    }`}
                />

                {/* Microphone Recording Button */}
                <button
                    type="button"
                    onClick={recording ? stopRecording : startRecording}
                    disabled={isBusy}
                    title={recording ? "Stop Recording & Send" : "Speak your query in any language"}
                    className={`p-3 rounded-lg text-white flex items-center justify-center transition shadow-sm ${
                        recording
                            ? "bg-red-600 hover:bg-red-700 animate-pulse"
                            : transcribing
                            ? "bg-amber-500 cursor-wait"
                            : "bg-gray-700 hover:bg-gray-800"
                    }`}
                >
                    {transcribing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : recording ? (
                        <Square className="w-5 h-5 fill-current" />
                    ) : (
                        <Mic className="w-5 h-5" />
                    )}
                </button>

                {/* Send Button */}
                <button
                    onClick={() => sendMessage()}
                    disabled={isBusy || recording || !input.trim()}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition ${
                        isBusy || recording || !input.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                    }`}
                >
                    {loading ? "Thinking..." : transcribing ? "Transcribing..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default InputBar;