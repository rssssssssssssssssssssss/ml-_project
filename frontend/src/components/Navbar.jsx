import { ShieldCheck, Sparkles, Building2, PhoneCall } from "lucide-react";

function Navbar({ onClearChat }) {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                
                {/* Brand Identity with Growth Emblem */}
                <div className="flex items-center gap-3.5">
                    <div className="relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xs opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <img 
                            src="/emblem.png" 
                            alt="Vedranta Bank Growth Emblem" 
                            className="relative w-11 h-11 object-contain rounded-xl shadow-xs border border-white/50 bg-white p-0.5"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                                Vedranta Bank
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Support
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium hidden sm:block">
                            Enterprise Vernacular AI Banking & Policy Assistant
                        </p>
                    </div>
                </div>

                {/* Badges and Clear Action */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 font-medium">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Verified Knowledge Base</span>
                    </div>

                    <button
                        onClick={onClearChat}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                        title="Start a fresh conversation"
                    >
                        New Chat
                    </button>
                </div>

            </div>
        </header>
    );
}

export default Navbar;