import React from 'react';
import { 
  LayoutDashboard, TrendingUp, Search, LogOut, 
  Gem, Info, Mail, ShieldCheck 
} from 'lucide-react'; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'market', label: 'Pasar Realtime', icon: <TrendingUp size={20} /> },
    { id: 'gainers', label: 'Top Movers', icon: <LayoutDashboard size={20} /> },
    { id: 'screener', label: 'AI Screener', icon: <Search size={20} /> },
    { id: 'gems', label: 'Hidden Gems', icon: <Gem size={20} /> }, 
  ];

  const legalItems = [
    { id: 'about', label: 'About Us', icon: <Info size={18} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sky-600 tracking-tighter uppercase">SAHAMFINGERS</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2">Pasar</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${activeTab === item.id ? 'bg-sky-50 text-sky-700 shadow-sm border-l-4 border-sky-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2">Legal & Info</p>
          {legalItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all
                ${activeTab === item.id ? 'text-sky-600 font-bold' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition">
          <LogOut size={20} /> Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;