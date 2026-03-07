import { AlertCircle, Bot, Send, X, Activity, BrainCircuit, TrendingDown, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ district }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hi Official! Predictor AI. I've analyzed the budget for ${district?.name || 'your region'}. Ask me anything about allocations, anomalies, or predictions.` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Add a slight delay to ensure DOM is updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and response based on keywords
    setTimeout(() => {
      let aiResponse = "I have logged your query. My analysis models are continuously monitoring the regional data.";
      const lowerInput = userMsg.toLowerCase();

      if (lowerInput.includes('leakage') || lowerInput.includes('anomaly') || lowerInput.includes('fraud')) {
        aiResponse = "I detected potential leakage in the Healthcare sector. Vendor payments have increased by 40% while on-ground deliverables show 0% progress. I recommend freezing unspent funds immediately.";
      } else if (lowerInput.includes('reallocate') || lowerInput.includes('optimize')) {
        aiResponse = "Analyzing optimal redistribution... I suggest moving ₹50Cr from the Infrastructure 'Road Expansion' budget (currently stalled) directly to Rural Development which is facing an immediate deficit.";
      } else if (lowerInput.includes('predict') || lowerInput.includes('future') || lowerInput.includes('forecast')) {
        aiResponse = "Based on expenditure velocity in Q1-Q3, the Education department is projected to surrender 15% of its budget by fiscal end. Action is recommended.";
      } else if (lowerInput.includes('status') || lowerInput.includes('summary')) {
        aiResponse = `The current utilization for ${district?.name || 'this district'} is sitting around ${Math.round((district?.spent / district?.allocation) * 100)}%. We are on track, but some departments demand attention.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(79,70,229,0.4)] hover:scale-110 hover:bg-indigo-700 transition-all z-50 flex items-center justify-center ${isOpen ? 'hidden' : 'block animate-bounce'}`}
      >
        <BrainCircuit size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                  Predictor AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-indigo-100 font-medium uppercase tracking-wider">GovTech Intelligence Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-indigo-100 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 relative overflow-hidden bg-slate-50">
            <div ref={scrollContainerRef} className="absolute inset-0 p-4 h-full w-full overflow-y-auto flex flex-col space-y-4">

            {/* AI Suggestion Chips (Hackathon wow-factor) */}
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar shrink-0">
              <button
                onClick={() => setInput("Show me recent leakages")}
                className="flex-shrink-0 bg-white border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-rose-50 flex items-center gap-1 shadow-sm"
              >
                <AlertCircle size={12} /> Scan Leakages
              </button>
              <button
                onClick={() => setInput("Optimize my budget")}
                className="flex-shrink-0 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-emerald-50 flex items-center gap-1 shadow-sm"
              >
                <RefreshCw size={12} /> Optimize Budget
              </button>
              <button
                onClick={() => setInput("Predict Q4 spending")}
                className="flex-shrink-0 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1 shadow-sm"
              >
                <TrendingDown size={12} /> Predictions
              </button>
            </div>

            {/* Chat History Container */}
            <div className="flex-1 flex flex-col space-y-4 filter-none pb-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-200 font-medium'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none font-medium shadow-sm leading-relaxed'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
            
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Predictor AI..."
                className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl pl-4 pr-12 py-3 text-sm font-medium text-slate-800 transition-all outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
