import ollama from "ollama";
import { getRelevantContext } from "../rag/rag.service.js";

import {
    getConversation,
    addMessage,
} from "../memory/memory.service.js";

export async function generateResponse(sessionId, message) {
    console.log("generateResponse() arguments:");
    console.log("sessionId =", sessionId);
    console.log("message =", message);

    // Save user's message
    addMessage(sessionId, "user", message);

    // Retrieve relevant company context
    const context = await getRelevantContext(message);

    // Build messages for Qwen
    const messages = [
        {
            role: "system",
            content: `
You are a helpful AI assistant for the organization.

Answer ONLY from the provided company context.

If the answer is not available in the context, say:
"I couldn't find this information in the provided company documents."

Do not make up answers.

Always answer in the same language as the user's question.

Company Context:
----------------
${context}
----------------
            `,
        },

        ...getConversation(sessionId),
    ];

    console.log("Messages being sent to Qwen:");
    console.log(JSON.stringify(messages, null, 2));

    // Generate response
    const response = await ollama.chat({
        model: "qwen2.5:7b",
        messages,
    });

    // Save assistant response
    addMessage(sessionId, "assistant", response.message.content);

    return response.message.content;
}