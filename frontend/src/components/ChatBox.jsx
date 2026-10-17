import Message from "./Message";

function ChatBox({ messages, loading }) {

    return (

        <div className="flex-1 overflow-y-auto">

            <div className="max-w-5xl mx-auto p-8">

                {messages.length === 0 && !loading ? (

                    <div className="text-center text-gray-500 mt-40">

                        <h2 className="text-3xl font-semibold mb-3 text-gray-800">
                            Welcome to Vedranta Bank
                        </h2>

                        <p className="text-gray-500 max-w-md mx-auto">
                            Ask anything about accounts, personal loans, home loans, customer service, or policies in your preferred language.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {messages.map((message, index) => (

                            <Message
                                key={index}
                                sender={message.sender}
                                text={message.text}
                            />

                        ))}

                        {loading && (
                            <Message
                                sender="assistant"
                                text="Thinking..."
                            />
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}

export default ChatBox;