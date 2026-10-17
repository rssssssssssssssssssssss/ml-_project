import { useState, useRef } from "react";
import { Mic, Square, Loader2, Globe, SendHorizontal } from "lucide-react";
import API from "../services/api";

const LANGUAGES = [
    { code: "auto", label: "Auto Detect" },
    { code: "hindi", label: "Hindi (हिन्दी)" },
    { code: "english", label: "English" },
];

function InputBar({ setMessages, loading, setLoading, initialInput = "" }) {
    const [input, setInput] = useState(initialInput);
    const [recording, setRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("auto");

    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const audioWorkletNodeRef = useRef(null);
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

    // Convert Float32Array PCM to 16-bit PCM WAV Blob
    function encodeWAV(samples, sampleRate) {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        /* RIFF identifier */
        writeString(view, 0, 'RIFF');
        /* file length */
        view.setUint32(4, 36 + samples.length * 2, true);
        /* RIFF type */
        writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw PCM) */
        view.setUint16(20, 1, true);
        /* channel count (mono) */
        view.setUint16(22, 1, true);
        /* sample rate */
        view.setUint32(24, sampleRate, true);
        /* byte rate (sampleRate * 2) */
        view.setUint32(28, sampleRate * 2, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        // write 16-bit PCM samples
        let offset = 44;
        for (let i = 0; i < samples.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }

        return new Blob([view], { type: 'audio/wav' });
    }

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    async function startRecording() {
        if (loading || transcribing) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 16000
                }
            });
            streamRef.current = stream;

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioCtx({ sampleRate: 16000 });
            audioContextRef.current = audioCtx;

            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            audioChunksRef.current = [];

            processor.onaudioprocess = (e) => {
                const channelData = e.inputBuffer.getChannelData(0);
                audioChunksRef.current.push(new Float32Array(channelData));
            };

            source.connect(processor);
            processor.connect(audioCtx.destination);
            audioWorkletNodeRef.current = processor;

            setRecording(true);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Could not access microphone. Please check browser microphone permissions.");
        }
    }

    async function stopRecording() {
        if (!recording) return;

        setRecording(false);

        try {
            if (audioWorkletNodeRef.current) {
                audioWorkletNodeRef.current.disconnect();
            }
            if (audioContextRef.current) {
                await audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const totalSamples = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
            if (totalSamples === 0) return;

            const merged = new Float32Array(totalSamples);
            let offset = 0;
            for (const chunk of audioChunksRef.current) {
                merged.set(chunk, offset);
                offset += chunk.length;
            }

            const wavBlob = encodeWAV(merged, 16000);
            if (wavBlob.size > 100) {
                await sendAudioForTranscription(wavBlob);
            }
        } catch (err) {
            console.error("Error finalizing audio recording:", err);
        }
    }

    async function sendAudioForTranscription(audioBlob) {
        setTranscribing(true);
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "user_speech.wav");
            formData.append("language", selectedLanguage);

            const response = await API.post("/chat/transcribe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.success && response.data.text) {
                const transcribedText = response.data.text.trim();
                if (transcribedText) {
                    await sendMessage(transcribedText);
                } else {
                    alert("No speech detected. Please speak clearly into your mic and try again.");
                }
            } else {
                alert("Could not recognize audio. Please speak clearly and try again.");
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
        <div className="bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 sm:py-4 shadow-lg sticky bottom-0 z-20">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                
                {/* Language Selector Pill */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-2 shrink-0">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        disabled={isBusy || recording}
                        className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                        title="Speech language mode"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Input Text Box */}
                <div className="relative flex-1 flex items-center">
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
                                ? "🔴 Recording... Click Stop to analyze voice query"
                                : transcribing
                                ? "⏳ Whisper is transcribing your audio on GPU..."
                                : "Ask Vedranta Bank about accounts, loans, policies, or click mic..."
                        }
                        className={`w-full border rounded-2xl pl-4 pr-11 py-3 outline-none transition text-sm ${
                            recording
                                ? "border-red-500 bg-red-50/70 ring-2 ring-red-400/50 placeholder-red-600 font-medium"
                                : "border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 disabled:bg-slate-100"
                        }`}
                    />

                    {/* Send inside input box on desktop */}
                    <button
                        onClick={() => sendMessage()}
                        disabled={isBusy || recording || !input.trim()}
                        className={`absolute right-2 p-2 rounded-xl transition ${
                            isBusy || recording || !input.trim()
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-blue-600 hover:bg-blue-50 cursor-pointer"
                        }`}
                        title="Send question"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                            <SendHorizontal className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Microphone Recording Action Button */}
                <button
                    type="button"
                    onClick={recording ? stopRecording : startRecording}
                    disabled={isBusy}
                    title={recording ? "Stop Recording & Submit Query" : `Speak voice query in ${LANGUAGES.find(l => l.code === selectedLanguage)?.label}`}
                    className={`p-3 rounded-2xl text-white flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
                        recording
                            ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-200 animate-pulse scale-105"
                            : transcribing
                            ? "bg-amber-500 cursor-wait"
                            : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20 hover:shadow-md"
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

            </div>
        </div>
    );
}

export default InputBar;