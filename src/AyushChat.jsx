import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Plus, MessageSquare, Send, Paperclip, 
  FileText, X, Leaf, User, Sparkles, Settings
} from 'lucide-react';

// Mock History for Sidebar
const CHAT_HISTORY = [
  { id: 1, title: "Dengue Prevention Diet", date: "Today" },
  { id: 2, title: "Managing Vata Imbalance", date: "Yesterday" },
  { id: 3, title: "Yoga for Acid Reflux", date: "Previous 7 Days" },
];

export default function AyushChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Namaste! I am your AYUSH Sentinel AI. You can describe your symptoms, ask about traditional remedies, or securely upload your medical reports (PDF) for a holistic analysis. How can I guide you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileChange = (e) => {
    const file = e.target.files;
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    // 1. Add User Message
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      file: selectedFile ? selectedFile.name : null
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setSelectedFile(null);
    setIsTyping(true);

    // 2. Mock AI Response Delay
    setTimeout(() => {
      const mockResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: newUserMsg.file 
          ? `I have analyzed "${newUserMsg.file}". Based on your blood work and the principles of Ayurveda, I notice a severe Pitta dosha aggravation. I recommend incorporating cooling herbs like Amla and avoiding spicy, fermented foods. Would you like a 7-day meal plan?`
          : "Based on the symptoms you described, classical Siddha medicine suggests preparing a decoction of Nilavembu. Ensure you stay hydrated and practice Shavasana to lower your stress levels."
      };
      setMessages(prev => [...prev, mockResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F7FDF7] to-[#E8F5E9] text-[#1B1B1B] font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/60 backdrop-blur-2xl border-r border-[#E8F5E9] transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-[4px_0_24px_rgba(46,125,50,0.05)]`}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#2E7D32]">
            <div className="bg-[#E8F5E9] p-2 rounded-xl"><Leaf className="w-5 h-5" /></div>
            <span className="font-bold text-lg tracking-tight">AYUSH Chat</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-[#2E7D32]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-2">
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white py-3 px-4 rounded-xl hover:shadow-[0_8px_20px_rgba(46,125,50,0.3)] transition-all duration-300 hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Consultation</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Consultations</p>
            <div className="space-y-1">
              {CHAT_HISTORY.map((chat) => (
                <button key={chat.id} className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left hover:bg-[#E8F5E9] transition-colors group">
                  <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32]" />
                  <span className="text-sm text-gray-700 group-hover:text-[#1B1B1B] truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* User Profile Area */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/80 transition-colors">
            <div className="bg-gradient-to-r from-[#F4A261] to-[#E76F51] p-2 rounded-full text-white">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold">Patient Profile</p>
              <p className="text-xs text-gray-500">Settings & Vitals</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative w-full h-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-[#E8F5E9] sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-[#2E7D32]">AYUSH Sentinel</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-32">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                
                {/* AI Avatar */}
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A5D6A7] to-[#2E7D32] flex items-center justify-center text-white mr-3 shrink-0 mt-1 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-[20px] px-5 py-4 ${
                  msg.sender === 'user' 
                    ? 'bg-[#2E7D32] text-white rounded-tr-sm shadow-[0_8px_20px_rgba(46,125,50,0.2)]' 
                    : 'bg-white text-gray-800 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E8F5E9]'
                }`}>
                  
                  {/* File Attachment Render */}
                  {msg.file && (
                    <div className="flex items-center space-x-2 bg-black/10 p-3 rounded-xl mb-3 border border-white/20">
                      <FileText className="w-5 h-5 text-white/90" />
                      <span className="text-sm font-medium text-white/90 truncate">{msg.file}</span>
                    </div>
                  )}
                  
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 ml-3 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A5D6A7] to-[#2E7D32] flex items-center justify-center text-white mr-3 shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white px-5 py-4 rounded-[20px] rounded-tl-sm shadow-sm border border-[#E8F5E9] flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-[#A5D6A7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#A5D6A7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#A5D6A7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F7FDF7] via-[#F7FDF7] to-transparent pt-10 pb-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Selected File Preview Pill */}
            {selectedFile && (
              <div className="mb-3 flex items-center inline-flex bg-white shadow-sm border border-[#A5D6A7] rounded-full px-4 py-1.5 animate-fade-in-up">
                <FileText className="w-4 h-4 text-[#2E7D32] mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                <button 
                  onClick={() => setSelectedFile(null)} 
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form 
              onSubmit={handleSend}
              className="relative flex items-end bg-white rounded-[24px] shadow-[0_10px_40px_rgba(46,125,50,0.1)] border border-[#E8F5E9] p-2 focus-within:ring-2 focus-within:ring-[#A5D6A7] focus-within:border-transparent transition-all"
            >
              {/* Hidden File Input */}
              <input 
                type="file" 
                accept=".pdf" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
              />
              
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="p-3 text-gray-400 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-xl transition-colors"
                title="Attach Medical Report (PDF)"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask about your symptoms or upload a medical report..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-gray-800 placeholder-gray-400 text-[15px] outline-none"
                rows={1}
              />

              <button 
                type="submit" 
                disabled={!inputValue.trim() && !selectedFile}
                className={`p-3 rounded-xl ml-2 transition-all duration-300 ${
                  inputValue.trim() || selectedFile 
                    ? 'bg-gradient-to-r from-[#F4A261] to-[#E76F51] text-white shadow-md hover:-translate-y-0.5' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
            
            <p className="text-center text-xs text-gray-400 mt-3">
              AYUSH Sentinel AI can make mistakes. Always consult with a certified AYUSH practitioner before starting new treatments.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}