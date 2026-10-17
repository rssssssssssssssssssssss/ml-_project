import { User, Copy, Check } from "lucide-react";
import { useState } from "react";

function Message({ sender, text }) {
    const isUser = sender === "user";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex w-full gap-3.5 my-3 ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
            
            {/* Assistant Avatar with Growth Emblem */}
            {!isUser && (
                <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-slate-200/80 shadow-xs bg-white p-0.5 mt-0.5">
                    <img 
                        src="/emblem.png" 
                        alt="Vedranta Bank" 
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            {/* Bubble Container */}
            <div className={`relative group max-w-2xl px-5 py-3.5 rounded-2xl shadow-xs transition-all ${
                isUser 
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs" 
                    : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-slate-100"
            }`}>
                <div className="text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {text}
                </div>

                {/* Assistant message copy action */}
                {!isUser && (
                    <button
                        onClick={handleCopy}
                        title="Copy response"
                        className="absolute right-2 bottom-1.5 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition duration-150 cursor-pointer"
                    >
                        {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                    </button>
                )}
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-xs mt-0.5">
                    <User className="w-4 h-4 text-slate-200" />
                </div>
            )}

        </div>
    );
}

export default Message;