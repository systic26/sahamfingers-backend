import React from 'react';
import { LayoutDashboard, TrendingUp, Search, LogOut, Gem } from 'lucide-react'; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'market', label: 'Pasar Realtime', icon: <TrendingUp size={20} /> },
    { id: 'gainers', label: 'Top Gainers (LQ45)', icon: <LayoutDashboard size={20} /> },
    { id: 'screener', label: 'AI Screener & Bandar', icon: <Search size={20} /> },
    { id: 'gems', label: 'Hidden Gems (Fund)', icon: <Gem size={20} /> }, 
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sky-600 tracking-tighter">SAHAMFINGERS</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === item.id 
                ? 'bg-sky-50 text-sky-700 shadow-sm border-l-4 border-sky-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition">
          <LogOut size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;