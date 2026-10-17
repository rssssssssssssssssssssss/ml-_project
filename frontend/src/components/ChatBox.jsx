import { Building2, Home, CreditCard, HelpCircle, Sparkles, Shield, Clock } from "lucide-react";
import Message from "./Message";
import { useEffect, useRef } from "react";

const SUGGESTED_QUESTIONS = [
    {
        title: "Personal Loans",
        desc: "Eligibility & processing steps",
        query: "What is the personal loan eligibility criteria at Vedranta Bank?",
        icon: CreditCard,
        color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
        title: "Home Loans",
        desc: "Interest & document guide",
        query: "What documents are required to apply for a Home Loan at Vedranta Bank?",
        icon: Home,
        color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
        title: "Customer Support",
        desc: "Grievances & branch help",
        query: "What is Vedranta Bank's grievance and complaint resolution policy?",
        icon: HelpCircle,
        color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
        title: "Bank Profile",
        desc: "Headquarters & channels",
        query: "Where is Vedranta Bank headquarters and what channels are available?",
        icon: Building2,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
];

function ChatBox({ messages, loading, onSelectPrompt }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
            <div className="max-w-4xl mx-auto">
                
                {messages.length === 0 && !loading ? (
                    <div className="py-8 sm:py-14 text-center">
                        
                        {/* Emblem Hero Card */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute -inset-2 bg-linear-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-md"></div>
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl p-3 bg-white border border-slate-100 shadow-xl flex items-center justify-center">
                                <img 
                                    src="/emblem.png" 
                                    alt="Vedranta Bank Growth Emblem" 
                                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Title & Tagline */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Welcome to <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vedranta Bank</span>
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
                            Your intelligent AI assistant for policy verification, retail loans, account inquiries, and services. Ask via voice or text in English or Hindi.
                        </p>

                        {/* Quick Prompts Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
                            {SUGGESTED_QUESTIONS.map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => onSelectPrompt && onSelectPrompt(item.query)}
                                        className="group p-3.5 bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 rounded-2xl shadow-xs transition-all duration-200 cursor-pointer flex items-start gap-3 text-left"
                                    >
                                        <div className={`p-2 rounded-xl border ${item.color} shrink-0 group-hover:scale-105 transition duration-200`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Security Assurance Footer */}
                        <div className="flex items-center justify-center gap-4 mt-10 text-[11px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-slate-400" />
                                Private Local Ollama Inference
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                24/7 Knowledge RAG Access
                            </span>
                        </div>

                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <Message
                                key={index}
                                sender={message.sender}
                                text={message.text}
                            />
                        ))}

                        {/* Thinking Skeleton State */}
                        {loading && (
                            <div className="flex w-full gap-3.5 my-3 justify-start animate-fadeIn">
                                <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-slate-200/80 shadow-xs bg-white p-0.5 mt-0.5">
                                    <img 
                                        src="/emblem.png" 
                                        alt="Vedranta Bank" 
                                        className="w-full h-full object-contain animate-pulse"
                                    />
                                </div>
                                <div className="bg-white border border-slate-200/80 text-slate-600 px-5 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                                    <span className="text-xs font-medium text-slate-500">Vedranta Assistant is synthesizing policy context...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}

            </div>
        </div>
    );
}

export default ChatBox;