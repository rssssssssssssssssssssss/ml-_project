import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import InputBar from "../components/InputBar";
import API from "../services/api";

function Home() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleClearChat = () => {
        setMessages([]);
    };

    const handleSelectPrompt = (promptText) => {
        // Automatically inject and send prompt
        setMessages(prev => [
            ...prev,
            {
                sender: "user",
                text: promptText,
            },
        ]);

        setLoading(true);

        API.post("/chat", {
            sessionId: "user1",
            message: promptText,
        }).then(response => {
            setMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: response.data.reply,
                },
            ]);
        }).catch(err => {
            console.error(err);
            setMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: "Something went wrong while contacting the server.",
                },
            ]);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50/70 font-sans antialiased text-slate-800 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
            <Navbar onClearChat={handleClearChat} />

            <ChatBox
                messages={messages}
                loading={loading}
                onSelectPrompt={handleSelectPrompt}
            />

            <InputBar
                setMessages={setMessages}
                loading={loading}
                setLoading={setLoading}
            />
        </div>
    );
}

export default Home;