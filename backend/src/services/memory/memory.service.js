const sessions = new Map();

export function getConversation(sessionId) {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
    }

    return sessions.get(sessionId);
}

export function addMessage(sessionId, role, content) {
    const conversation = getConversation(sessionId);

    conversation.push({
        role,
        content,
    });

    // Keep only the last 20 messages
    if (conversation.length > 20) {
        conversation.shift();
    }
}