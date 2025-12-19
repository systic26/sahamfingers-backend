import React from 'react';
import { LayoutDashboard, TrendingUp, Search, LogOut, Gem, Info, Mail, ShieldCheck, BookOpen } from 'lucide-react'; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'market', label: 'Pasar Realtime', icon: <TrendingUp size={20} /> },
    { id: 'gainers', label: 'Top Movers', icon: <LayoutDashboard size={20} /> },
    { id: 'screener', label: 'AI God Mode', icon: <Search size={20} /> },
    { id: 'gems', label: 'Hidden Gems', icon: <Gem size={20} /> }, 
    { id: 'help', label: 'Panduan & Edukasi', icon: <BookOpen size={20} /> }, // MENU BARU
  ];

  const legalItems = [
    { id: 'about', label: 'About Us', icon: <Info size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-700 tracking-tighter">SAHAMFINGERS</h1>
        <p className="text-[10px] text-gray-400 font-medium tracking-widest mt-1">INSTITUTIONAL GRADE AI</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2 mt-2">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border-l-4 border-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="pt-6 mt-4 border-t border-gray-50">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2">Legal & Info</p>
          {legalItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === item.id ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 text-center mb-3">
            <p className="text-[10px] text-white/80 uppercase font-bold">Status Server</p>
            <div className="flex items-center justify-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-white">V6.0 ONLINE</span>
            </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition justify-center">
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;