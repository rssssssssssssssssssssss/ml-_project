import ollama from "ollama";

try {
    const response = await ollama.chat({
        model: "qwen2.5:7b",
        messages: [
            {
                role: "user",
                content: "Say hello in one sentence.",
            },
        ],
    });

    console.log(response.message.content);
} catch (err) {
    console.error(err);
}