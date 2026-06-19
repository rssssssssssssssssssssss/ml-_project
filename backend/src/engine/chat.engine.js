import { generateResponse } from "../services/llm/qwen.service.js";

export async function processChat(sessionId, message) {

    const reply = await generateResponse(sessionId, message);

    return reply;

}