import React, { useState } from 'react';
import { 
  Leaf, Activity, Map as MapIcon, AlertTriangle, 
  TrendingUp, ShieldCheck, HeartPulse, MapPin, 
  Thermometer, Wind, AlertCircle, MessageSquare // <-- Added MessageSquare
} from 'lucide-react';

// IMPORT YOUR CHAT COMPONENT
import AyushChat from './AyushChat'; 

const SYMPTOM_LIST = [
  "High Fever", "Severe Headache", "Joint Pain", "Dry Cough", 
  "Fatigue", "Nausea", "Acid Reflux", "Skin Rash", 
  "Shortness of Breath", "Muscle Aches"
];

export default function AyushApp() {
  const [activeView, setActiveView] = useState('patient');

  // --- TOP LEVEL INTERCEPT FOR FULL-SCREEN CHAT ---
  if (activeView === 'chat') {
    return (
      <div className="relative w-full h-screen">
        {/* Floating Navigation to get back to the main app */}
        <div className="absolute top-4 right-4 z-50 bg-white/60 backdrop-blur-xl p-1.5 rounded-full flex space-x-1 shadow-[0_8px_30px_rgba(46,125,50,0.15)] border border-[#A5D6A7]">
          <button 
            onClick={() => setActiveView('patient')} 
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#2E7D32] rounded-full hover:bg-white transition-all duration-300 flex items-center"
          >
            <HeartPulse className="w-4 h-4 mr-2" /> Exit to Patient Portal
          </button>
          <button 
            onClick={() => setActiveView('admin')} 
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#2E7D32] rounded-full hover:bg-white transition-all duration-300 flex items-center"
          >
            <Activity className="w-4 h-4 mr-2" /> Exit to Admin
          </button>
        </div>
        
        {/* The Chat Component */}
        <AyushChat />
      </div>
    );
  }

  // --- STANDARD PATIENT & ADMIN LAYOUT ---
  return (
    // Global Wrapper: Soft gradient background, Inter/Poppins system fonts
    <div className="min-h-screen bg-gradient-to-br from-[#F7FDF7] to-[#E8F5E9] text-[#1B1B1B] font-sans selection:bg-[#A5D6A7] selection:text-[#1B5E20]">
      
      {/* Premium Glassmorphism Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Leaf className="h-7 w-7 text-[#A5D6A7]" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#A5D6A7]">
                AYUSH Sentinel
              </span>
            </div>

            {/* Pill-style Toggle Container */}
            <div className="flex space-x-1 bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <button 
                onClick={() => setActiveView('patient')}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeView === 'patient' 
                    ? 'bg-white text-[#2E7D32] shadow-md transform scale-105' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <HeartPulse className="w-4 h-4 mr-2" />
                Patient Portal
              </button>
              <button 
                onClick={() => setActiveView('admin')}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeView === 'admin' 
                    ? 'bg-white text-[#2E7D32] shadow-md transform scale-105' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Activity className="w-4 h-4 mr-2" />
                Admin Dashboard
              </button>
              
              {/* NEW CHAT BUTTON */}
              <button 
                onClick={() => setActiveView('chat')}
                className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeView === 'chat' 
                    ? 'bg-white text-[#2E7D32] shadow-md transform scale-105' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AYUSH AI Chat
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* --- PREMIUM HERO SECTION --- */}
      <header className="relative w-full overflow-hidden py-24 lg:py-32 flex flex-col items-center justify-center min-h-[60vh]">
        
        {/* Layer 1 & 2: Base Gradient & Pattern Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#F7FDF7] to-[#E8F5E9]"></div>
        <div 
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}
        ></div>

        {/* Layer 3: Central Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(165,214,167,0.35),transparent_65%)] pointer-events-none z-0"></div>

        {/* Layer 4: Floating Organic Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          {/* Top Left Green Blob */}
          <div className="absolute -top-[10%] -left-[5%] w-[400px] h-[400px] bg-[#A5D6A7] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
          
          {/* Top Right Deep Green Blob */}
          <div 
            className="absolute top-[5%] -right-[5%] w-[350px] h-[350px] bg-[#2E7D32] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob" 
            style={{ animationDelay: '2s' }}
          ></div>
          
          {/* Bottom Center Soft Glow */}
          <div 
            className="absolute -bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[#81C784] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob" 
            style={{ animationDelay: '4s' }}
          ></div>
        </div>

        {/* --- Content Layer (Must be z-10 to sit above the blobs) --- */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          
          {/* Glassmorphic Badge */}
          <div className="inline-flex items-center justify-center px-6 py-2.5 mb-8 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_4px_15px_rgba(46,125,50,0.08)] text-[#2E7D32] font-semibold text-sm animate-fade-in-up">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#2E7D32]" />
            Personalized Wellness Powered by AI
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1B1B1B] mb-6 leading-[1.15] tracking-tight drop-shadow-sm">
            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E7D32] to-[#558B2F]">AYUSH</span><br/> Health System
          </h1>
          
          {/* Subtext with slight glass backing for readability */}
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8 bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-sm">
            Bridging the ancient wisdom of traditional healing with predictive artificial intelligence for personalized care and public health forecasting.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {activeView === 'patient' && <PatientPortal />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

// --- PATIENT PORTAL COMPONENT ---
function PatientPortal() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`AI Processing symptoms: ${selectedSymptoms.join(", ")}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Side: Wellness Information */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-[24px] p-10 text-white shadow-[0_10px_40px_rgba(46,125,50,0.2)] relative overflow-hidden">
        <Leaf className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-5" strokeWidth={1} />
        
        <h2 className="text-3xl font-bold mb-6">Discover Your Balance</h2>
        <p className="text-[#A5D6A7] text-lg mb-8 leading-relaxed">
          Tell us how you're feeling today. Our AI analyzes your symptoms through the lens of Ayurveda, Yoga, Unani, Siddha, and Homeopathy to recommend natural, root-cause remedies.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl"><Thermometer className="text-white w-6 h-6"/></div>
            <div>
              <h4 className="font-semibold text-lg">Symptom Analysis</h4>
              <p className="text-white/70 text-sm">Identifying Dosha imbalances</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl"><Wind className="text-white w-6 h-6"/></div>
            <div>
              <h4 className="font-semibold text-lg">Lifestyle Alignment</h4>
              <p className="text-white/70 text-sm">Personalized diet and Yoga asanas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Interactive Form Card */}
      <div className="lg:col-span-7 bg-white/90 backdrop-blur-xl rounded-[24px] p-10 shadow-[0_10px_40px_rgba(46,125,50,0.1)] border border-[#E8F5E9]">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#1B1B1B]">How are you feeling?</h3>
          <p className="text-gray-500 mt-2">Select all the symptoms you are currently experiencing.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-3 mb-10">
            {SYMPTOM_LIST.map((symptom, idx) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    isSelected 
                      ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32] shadow-sm transform scale-[1.02]' 
                      : 'bg-[#F9FFF9] border-[#C8E6C9] text-gray-600 hover:border-[#A5D6A7] hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {symptom}
                </button>
              );
            })}
          </div>

          <button 
            type="submit" 
            disabled={selectedSymptoms.length === 0}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 flex justify-center items-center shadow-lg ${
              selectedSymptoms.length > 0 
                ? 'bg-gradient-to-r from-[#F4A261] to-[#E76F51] hover:shadow-[0_8px_25px_rgba(244,162,97,0.4)] hover:-translate-y-1' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Generate AYUSH Protocol
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD COMPONENT ---
function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[20px] p-6 shadow-[0_10px_40px_rgba(46,125,50,0.08)] border border-[#E8F5E9] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Alerts</p>
              <h4 className="text-3xl font-bold text-[#1B1B1B] mt-1">3</h4>
            </div>
            <div className="bg-red-50 p-3 rounded-xl"><AlertTriangle className="text-red-500 w-6 h-6" /></div>
          </div>
          <p className="text-sm text-red-600 flex items-center font-medium">
            <TrendingUp className="w-4 h-4 mr-1" /> +2 since yesterday
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_10px_40px_rgba(46,125,50,0.08)] border border-[#E8F5E9] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Monitoring Zones</p>
              <h4 className="text-3xl font-bold text-[#1B1B1B] mt-1">12</h4>
            </div>
            <div className="bg-[#E8F5E9] p-3 rounded-xl"><MapPin className="text-[#2E7D32] w-6 h-6" /></div>
          </div>
          <p className="text-sm text-[#2E7D32] flex items-center font-medium">
            Across 4 districts
          </p>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-[0_10px_40px_rgba(46,125,50,0.08)] border border-[#E8F5E9] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">AI Confidence Score</p>
              <h4 className="text-3xl font-bold text-[#1B1B1B] mt-1">94%</h4>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl"><Activity className="text-blue-500 w-6 h-6" /></div>
          </div>
          <p className="text-sm text-blue-600 flex items-center font-medium">
            Model: Random Forest Ensemble
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-[0_10px_40px_rgba(46,125,50,0.08)] border border-[#E8F5E9] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#1B1B1B]">Live Outbreak Heatmap</h3>
            <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-3 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-[#2E7D32] rounded-full mr-2 animate-pulse"></span> LIVE
            </span>
          </div>
          
          <div className="flex-grow bg-slate-100 rounded-[16px] min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <MapIcon className="w-16 h-16 text-slate-400 mb-4 z-10" />
            <p className="text-slate-500 font-medium z-10">[ Interactive Leaflet Map Component Will Render Here ]</p>
            <p className="text-slate-400 text-sm mt-2 z-10">Waiting for geospatial data stream...</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_40px_rgba(46,125,50,0.08)] border border-[#E8F5E9]">
          <h3 className="text-xl font-bold text-[#1B1B1B] mb-6">Emerging Threats</h3>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-bold text-sm">DENGUE RISK: HIGH</h4>
                <p className="text-red-600 text-xs mt-1">Chennai South (Pin: 600020). 45 cases of high fever reported in last 24h. Heavy rainfall detected.</p>
                <button className="mt-3 text-xs bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-50 transition-colors">
                  Dispatch Neem & Giloy
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-bold text-sm">CHOLERA WATCH</h4>
                <p className="text-yellow-700 text-xs mt-1">Madurai (Pin: 625001). 12% spike in GI symptoms post-monsoon.</p>
              </div>
            </div>

             <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-4 rounded-xl flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[#1B5E20] font-bold text-sm">STABLE: MALARIA</h4>
                <p className="text-[#2E7D32] text-xs mt-1">Coimbatore region showing normal baseline metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}