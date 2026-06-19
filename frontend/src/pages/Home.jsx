import { useState } from "react";

import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import InputBar from "../components/InputBar";

function Home() {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <div className="h-screen flex flex-col bg-gray-100">

            <Navbar />

            <ChatBox
                messages={messages}
                loading={loading}
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