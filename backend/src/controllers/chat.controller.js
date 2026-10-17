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

        const language = req.body.language || req.query.language || "auto";

        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype || "audio/wav" });
        formData.append("file", blob, req.file.originalname || "recording.wav");
        formData.append("form_lang", language);

        // Send language both as Query and Form for 100% guarantee
        const targetUrl = `http://127.0.0.1:8000/transcribe?language=${encodeURIComponent(language)}`;

        const response = await axios.post(targetUrl, formData);

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