function Message({ sender, text }) {

    const isUser = sender === "user";

    return (

        <div
            className={`flex ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >

            <div
                className={`max-w-3xl px-5 py-3 rounded-xl shadow-sm whitespace-pre-wrap ${
                    isUser
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800"
                }`}
            >
                {text}
            </div>

        </div>

    );

}

export default Message;