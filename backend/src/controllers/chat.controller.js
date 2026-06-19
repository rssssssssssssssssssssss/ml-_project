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