import axios from "axios";
import { processChat } from "../engine/chat.engine.js";

export async function chat(req, res) {
    try {
        const { sessionId, message } = req.body;
        const reply = await processChat(sessionId, message);

        res.json({
            success: true,
            reply
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export async function transcribeAudio(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No audio file uploaded"
            });
        }

        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype || "audio/webm" });
        formData.append("file", blob, req.file.originalname || "recording.webm");

        const response = await axios.post("http://127.0.0.1:8000/transcribe", formData);

        res.json(response.data);
    } catch (err) {
        console.error("Transcription Controller Error:", err.message);
        res.status(500).json({
            success: false,
            error: err.message,
            text: ""
        });
    }
}