import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { 
  AlertCircle, Search, RefreshCw, ArrowUp, Activity, 
  Cpu, TrendingUp, BrainCircuit, ShieldAlert, Clock, 
  Gem, Mail, Info, ShieldCheck 
} from 'lucide-react'; 
import Sidebar from './Sidebar';

// --- Komponen Halaman Legal (Syarat Mutlak Adsense) ---
const AboutPage = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Info className="text-sky-600" /> About SahamFingers
    </h2>
    <p className="text-gray-600 leading-relaxed">
      SahamFingers adalah platform analisis finansial modern yang menggabungkan kecerdasan buatan (AI) 
      dengan data pasar modal Indonesia secara realtime. Kami bertujuan membantu investor ritel 
      melakukan analisis teknikal dan fundamental secara efisien melalui integrasi data cloud.
    </p>
  </div>
);

const ContactPage = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex items-center gap-6 animate-in fade-in">
    <div className="bg-sky-100 p-5 rounded-full text-sky-600"><Mail size={40}/></div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Hubungi Kami</h2>
      <p className="text-gray-500 font-medium">Email: admin@systicco.my.id</p>
      <p className="text-sm text-gray-400 mt-1">Tim support kami siap membantu Anda 1x24 jam.</p>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-sm animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <ShieldCheck className="text-sky-600" /> Privacy Policy
    </h2>
    <div className="text-gray-600 space-y-3">
      <p>Aplikasi ini menghargai privasi data pengunjung. Kami tidak mengumpulkan atau menjual data pribadi Anda kepada pihak ketiga.</p>
      <p>Layanan kami menggunakan Google Adsense yang mungkin menempatkan cookies pada browser Anda untuk personalisasi iklan.</p>
      <p>Data saham bersumber dari pihak ketiga dan disediakan hanya untuk tujuan informasi pendidikan, bukan instruksi investasi.</p>
    </div>
  </div>
);

const DashboardSaham = () => {
  const [activeTab, setActiveTab] = useState('market'); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [symbol, setSymbol] = useState('BBCA'); 
  const [searchInput, setSearchInput] = useState('');
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(true);

  // Link Backend Vercel Online Lo
  const API_BASE = "https://sahamfingers-backend-git-main-systic26s-projects.vercel.app/api";

  const [marketData, setMarketData] = useState({ price: 0, change: 0, percent: 0, volume: 0, chart: [], is_mock: false });
  const [gainers, setGainers] = useState([]);
  const [gems, setGems] = useState([]);
  const [aiData, setAiData] = useState(null); 
  const [prediction, setPrediction] = useState(null); 

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/stock?symbol=${activeTab === 'screener' ? searchInput || symbol : symbol}&timeframe=${timeframe}`);
      if (response.data) setMarketData(response.data);
    } catch (error) { console.error("Error Market:", error); }
    setLoading(false);
  };

  const fetchGainers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/gainers`);
      if (response.data) setGainers(response.data);
    } catch (error) { console.error("Error Gainers:", error); }
    setLoading(false);
  };

  const fetchGems = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${API_BASE}/gems`);
        if (response.data) setGems(response.data);
    } catch (error) { console.error("Error Gems:", error); }
    setLoading(false);
  };

  const fetchAiAnalysis = async () => {
    setLoading(true);
    setPrediction(null); setAiData(null);     
    try {
      const targetSymbol = searchInput || symbol;
      const resAnalyze = await axios.get(`${API_BASE}/analyze?symbol=${targetSymbol}`);
      if (resAnalyze.data) setAiData(resAnalyze.data);
      const resPredict = await axios.get(`${API_BASE}/predict?symbol=${targetSymbol}`);
      if (resPredict.data) setPrediction(resPredict.data);
    } catch (error) { console.error("Error AI:", error); }
    setLoading(false);
  };

  useEffect(() => {
    const mainTabs = ['market', 'gainers', 'screener', 'gems'];
    if (mainTabs.includes(activeTab)) {
        if (activeTab === 'market') fetchMarketData();
        else if (activeTab === 'gainers') fetchGainers();
        else if (activeTab === 'screener') fetchAiAnalysis();
        else if (activeTab === 'gems') fetchGems();
    }
  }, [activeTab, timeframe]); 

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchInput.trim() !== "") {
      let clean = searchInput.toUpperCase();
      if(clean === 'IHSG') clean = '^JKSE';
      setSymbol(clean);
      if(activeTab === 'market') fetchMarketData();
      if(activeTab === 'screener') fetchAiAnalysis();
    }
  };

  const handleRefresh = () => {
      if(activeTab === 'market') fetchMarketData();
      else if(activeTab === 'gainers') fetchGainers();
      else if(activeTab === 'screener') fetchAiAnalysis();
      else if(activeTab === 'gems') fetchGems();
  };

  const chartOptions = {
    chart: { type: 'candlestick', height: 350, toolbar: { show: false } },
    xaxis: { type: 'datetime', labels: { style: { colors: '#64748b' } } },
    yaxis: { tooltip: { enabled: true }, labels: { style: { colors: '#64748b' }, formatter: (val) => val.toFixed(0) } },
    grid: { borderColor: '#f1f5f9' },
    plotOptions: { candlestick: { colors: { upward: '#16a34a', downward: '#dc2626' } } }
  };

  return (
    <div className="flex min-h-screen bg-sky-50 font-sans text-gray-700">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 md:ml-64">
        {/* Header Search & Clock */}
        <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative w-full max-w-md flex gap-2">
                <div className="relative w-full">
                    <input 
                        type="text" placeholder="Cari kode emiten (BBCA, GOTO...)"
                        className="bg-white pl-10 pr-4 py-2 rounded shadow-sm text-sm w-full outline-none focus:ring-2 focus:ring-sky-500"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
                <button onClick={handleRefresh} className="bg-white p-2 rounded shadow-sm hover:bg-gray-50 text-sky-600 transition border border-gray-100">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <div className="bg-sky-600 text-white px-4 py-2 rounded font-mono shadow-sm">
                {currentTime.toLocaleTimeString('id-ID')} WIB
            </div>
        </div>

        {/* --- Area Konten Utama --- */}
        {activeTab === 'market' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{(marketData.price || 0).toLocaleString('id-ID')}</h1>
                         <span className={`text-sm font-bold ${marketData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.percent.toFixed(2)}%)
                        </span>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['1H', '1W', '1M', '3Y'].map((tf) => (
                            <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-sm font-medium rounded-md ${timeframe === tf ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>{tf}</button>
                        ))}
                    </div>
                </div>
                <ReactApexChart options={chartOptions} series={[{ data: marketData.chart }]} type="candlestick" height={350} />
            </div>
        )}

        {activeTab === 'gainers' && (
             <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-800">Top Movers (IHSG)</h2></div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase"><tr><th className="px-6 py-4">Emiten</th><th className="px-6 py-4 text-right">Harga</th><th className="px-6 py-4 text-right">% Change</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {gainers.map((s, i) => (
                            <tr key={i} className="hover:bg-sky-50 transition cursor-pointer" onClick={()=>{setSymbol(s.symbol); setActiveTab('screener'); fetchAiAnalysis();}}>
                                <td className="px-6 py-4 font-bold">{s.symbol}</td>
                                <td className="px-6 py-4 text-right">{s.price.toLocaleString()}</td>
                                <td className={`px-6 py-4 text-right font-bold ${s.percent>=0?'text-green-600':'text-red-600'}`}>{s.percent.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        )}

        {activeTab === 'screener' && aiData && (
            <div className="space-y-6">
                {prediction && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold uppercase mb-2 opacity-80">AI Prediction T+1</p>
                                <h1 className="text-3xl font-extrabold">{prediction.symbol}</h1>
                                <p className="text-sm opacity-80">Target: {prediction.predicted_price.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-green-300">{prediction.signal}</p>
                                <p className="text-xs opacity-70">Conf: {prediction.confidence_accuracy}%</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-white rounded-xl shadow border p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-sky-600">{aiData.score}</div>
                    <div><h2 className="text-xl font-bold">Analysis: {aiData.verdict}</h2><p className="text-sm text-gray-500 italic">Technical Momentum Logic</p></div>
                </div>
            </div>
        )}

        {activeTab === 'gems' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gems.map((gem, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex justify-between mb-4"><h3 className="text-xl font-bold">{gem.symbol}</h3><span className="text-green-600 font-bold">{gem.price.toLocaleString()}</span></div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div><p className="text-gray-400 font-bold">PER</p><p className="font-bold">{gem.fundamental.PER}x</p></div>
                            <div><p className="text-gray-400 font-bold">PBV</p><p className="font-bold">{gem.fundamental.PBV}x</p></div>
                            <div><p className="text-gray-400 font-bold">ROE</p><p className="font-bold text-sky-600">{gem.fundamental.ROE}%</p></div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* --- Render Halaman Legal Baru --- */}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'privacy' && <PrivacyPage />}

      </main>
    </div>
  );
};

export default DashboardSaham;