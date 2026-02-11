'use client';

import { useState, useEffect, useRef } from 'react';
import {
    MessageSquare,
    Send,
    User,
    Search,
    MoreVertical,
    Info,
    Phone,
    Video,
    CheckCheck,
    Clock,
    Globe,
    Monitor,
    ChevronRight,
    Circle
} from 'lucide-react';
import { invokeIPC } from '@/lib/ipc';

export default function Chat() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const initChat = async () => {
            setLoading(true);
            // Seed chats if needed
            await invokeIPC('seed-chats');
            const data = await invokeIPC('get-chats');
            if (data) {
                setChats(data);
                if (data.length > 0) {
                    setSelectedChat(data[0]);
                }
            }
            setLoading(false);
        };
        initChat();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [selectedChat?.messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        const res = await invokeIPC('send-message', {
            visitorId: selectedChat.visitorId,
            text: message,
            sender: 'admin'
        });

        if (res.success) {
            setMessage('');
            // Refresh chats to get updated message list
            const updatedChats = await invokeIPC('get-chats');
            setChats(updatedChats);
            const updatedSelected = updatedChats.find(c => c.visitorId === selectedChat.visitorId);
            setSelectedChat(updatedSelected);
        }
    };

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        if (chat.unreadCount > 0) {
            await invokeIPC('mark-chat-read', chat.visitorId);
            const updatedChats = await invokeIPC('get-chats');
            setChats(updatedChats);
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm m-2 md:m-4 relative" dir="rtl">

            {/* Sidebar: Chat List */}
            <div className={`
                ${selectedChat && 'hidden md:flex'} 
                w-full md:w-80 border-l border-gray-100 flex flex-col bg-gray-50/30 z-20
            `}>
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-black text-gray-800 mb-4">گفتگوها</h2>
                    <div className="relative">
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="جستجو در گفتگوها..."
                            className="w-full pr-10 pl-4 py-2.5 bg-gray-100/50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white md:bg-transparent">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.visitorId}
                            onClick={() => handleSelectChat(chat)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white transition-all border-b border-gray-50 relative ${selectedChat?.visitorId === chat.visitorId ? 'bg-white border-r-4 border-teal-500' : ''}`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-lg shadow-sm">
                                    {chat.visitorName.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-gray-800 truncate text-sm">{chat.visitorName}</h3>
                                    <span className="text-[10px] text-gray-400 font-black font-sans uppercase">
                                        {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate leading-relaxed font-medium">
                                    {chat.lastMessage}
                                </p>
                            </div>
                            {chat.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-black rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-pulse">
                                    {chat.unreadCount}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Chat Window */}
            {selectedChat ? (
                <div className={`flex-1 flex flex-col bg-white z-10 ${!selectedChat && 'hidden'}`}>
                    {/* Header */}
                    <div className="px-4 md:px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="md:hidden p-2 text-gray-400 hover:text-teal-600 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 rotate-0" />
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-teal-500/20">
                                {selectedChat.visitorName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800 text-sm md:text-base leading-none">{selectedChat.visitorName}</h3>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Circle className={`w-2 h-2 fill-current ${selectedChat.status === 'online' ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {selectedChat.status === 'online' ? 'Active Now' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
                                <Info className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 bg-[#fcfdfe] custom-scrollbar">
                        {selectedChat.messages?.map((msg, idx) => {
                            const isAdmin = msg.sender === 'admin';
                            return (
                                <div
                                    key={idx}
                                    className={`flex ${isAdmin ? 'justify-start' : 'justify-end animate-in fade-in slide-in-from-bottom-2'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[70%] group`}>
                                        <div
                                            className={`
                                                px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                                ${isAdmin
                                                    ? 'bg-white text-gray-700 rounded-tr-none border border-gray-100'
                                                    : 'bg-teal-600 text-white rounded-tl-none font-medium shadow-teal-500/10'
                                                }
                                            `}
                                        >
                                            {msg.text}
                                            <div className={`flex items-center gap-1.5 mt-2 ${isAdmin ? 'text-gray-400' : 'text-teal-100'} text-[10px] font-black font-sans`}>
                                                <Clock className="w-3 h-3 opacity-60" />
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {!isAdmin && msg.read && <CheckCheck className="w-3.5 h-3.5 ml-1" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto items-center">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="پیام خود را اینجا بنویسید..."
                                    className="w-full pr-5 pl-5 py-3.5 bg-gray-50/80 border-transparent rounded-2xl text-sm md:text-base focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all outline-none text-gray-800 font-medium"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="bg-teal-600 text-white p-3.5 rounded-2xl hover:bg-teal-700 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-xl shadow-teal-500/20 active:scale-90 transition-all flex-shrink-0"
                            >
                                <Send className="w-6 h-6 rotate-180" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex items-center justify-center bg-[#fcfdfe]">
                    <div className="text-center p-8 max-w-sm">
                        <div className="w-24 h-24 bg-white rounded-3xl border border-gray-100 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200/50 group hover:scale-110 transition-transform duration-500">
                            <MessageSquare className="w-10 h-10 text-teal-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-3">مرکز پیام شین فارما</h3>
                        <p className="text-gray-400 leading-relaxed text-sm font-medium">
                            یک گفتگو را از لیست انتخاب کنید تا پیام‌ها را مشاهده نمایید و با بازدیدکنندگان در ارتباط باشید.
                        </p>
                    </div>
                </div>
            )}

            {/* Right Panel: Visitor Details (Hidden on mobile/tablet) */}
            {selectedChat && (
                <div className="hidden lg:flex w-72 border-r border-gray-100 bg-gray-50/30 flex-col animate-in slide-in-from-right-4 duration-300">
                    <div className="p-8 text-center bg-white border-b border-gray-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-teal-500/20"></div>
                        <div className="w-24 h-24 rounded-3xl bg-teal-50 flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-xl shadow-teal-500/10 transition-transform hover:rotate-3">
                            <User className="w-12 h-12 text-teal-600" />
                        </div>
                        <h3 className="font-black text-gray-800 text-lg">{selectedChat.visitorName}</h3>
                        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-gray-100 rounded-full">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{selectedChat.location}</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                        <section>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" /> مشخصات سیستمی
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Monitor className="w-4 h-4 text-teal-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Device</p>
                                        <p className="text-xs font-bold text-gray-700 truncate">{selectedChat.device}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Globe className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Location</p>
                                        <p className="text-xs font-bold text-gray-700 truncate">{selectedChat.location}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">عملیات سریع</h4>
                            <div className="space-y-2">
                                <button className="w-full text-right px-4 py-3 text-xs font-black text-gray-600 bg-white border border-gray-50 hover:border-teal-100 hover:text-teal-600 rounded-xl flex items-center justify-between transition-all group">
                                    مسدود کردن کاربر <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                                <button className="w-full text-right px-4 py-3 text-xs font-black text-gray-600 bg-white border border-gray-50 hover:border-teal-100 hover:text-teal-600 rounded-xl flex items-center justify-between transition-all group">
                                    انتقال به آرشیف <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                                <button className="w-full text-right px-4 py-3 text-xs font-black text-red-500 bg-white border border-gray-50 hover:bg-red-50 rounded-xl flex items-center justify-between transition-all group">
                                    پاک کردن گفتگو <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
