import { useState } from "react";
import API from "../services/api";

function InputBar({ setMessages, loading, setLoading }) {

    const [input, setInput] = useState("");

    async function sendMessage() {

        if (!input.trim() || loading) return;

        const message = input;

        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: message,
            },
        ]);

        setInput("");
        setLoading(true);

        try {

            const response = await API.post("/chat", {
                sessionId: "user1",
                message: message,
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
                    text: "Something went wrong.",
                },
            ]);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="bg-white border-t">

            <div className="max-w-5xl mx-auto p-4 flex gap-3">

                <input
                    type="text"
                    value={input}
                    disabled={loading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder="Type your question..."
                    className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className={`px-6 rounded-lg text-white transition ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Thinking..." : "Send"}
                </button>

            </div>

        </div>

    );

}

export default InputBar;