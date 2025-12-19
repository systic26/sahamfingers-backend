import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { AlertCircle, Search, RefreshCw, ArrowUp, Activity, Cpu, TrendingUp, BrainCircuit, ShieldAlert, Clock, Gem } from 'lucide-react'; 
import Sidebar from './Sidebar';

const DashboardSaham = () => {
  const [activeTab, setActiveTab] = useState('market'); 
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [symbol, setSymbol] = useState('BBCA'); 
  const [searchInput, setSearchInput] = useState('');
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(true);
  
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
      const response = await axios.get(`https://systicco-api-saham-pro.hf.space/api/stock?symbol=${activeTab === 'screener' ? searchInput || symbol : symbol}&timeframe=${timeframe}`);
      if (response.data) setMarketData(response.data);
    } catch (error) { console.error("Error Market:", error); }
    setLoading(false);
  };

  const fetchGainers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://systicco-api-saham-pro.hf.space/api/gainers`);
      if (response.data) setGainers(response.data);
    } catch (error) { console.error("Error Gainers:", error); }
    setLoading(false);
  };

  const fetchGems = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`https://systicco-api-saham-pro.hf.space/api/gems`);
        if (response.data) setGems(response.data);
    } catch (error) { console.error("Error Gems:", error); }
    setLoading(false);
  };

  const fetchAiAnalysis = async () => {
    setLoading(true);
    setPrediction(null); 
    setAiData(null);     
    
    try {
      const targetSymbol = searchInput || symbol;
      const resAnalyze = await axios.get(`https://systicco-api-saham-pro.hf.space/api/analyze?symbol=${targetSymbol}`);
      if (resAnalyze.data) setAiData(resAnalyze.data);

      const resPredict = await axios.get(`https://systicco-api-saham-pro.hf.space/api/predict?symbol=${targetSymbol}`);
      if (resPredict.data) setPrediction(resPredict.data);

    } catch (error) { console.error("Error AI:", error); }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'market') fetchMarketData();
    else if (activeTab === 'gainers') fetchGainers();
    else if (activeTab === 'screener') fetchAiAnalysis();
    else if (activeTab === 'gems') fetchGems();
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
        
        <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative w-full max-w-md flex gap-2">
                <div className="relative w-full">
                    <input 
                        type="text" placeholder={activeTab === 'screener' ? "Analisis Emiten (contoh: BBCA)..." : "Cari emiten..."}
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
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    <Clock size={12} />
                    <span>Delay 15m</span>
                </div>
                <div className="bg-sky-600 text-white px-4 py-2 rounded font-mono shadow-sm">
                    {currentTime.toLocaleTimeString('id-ID')} WIB
                </div>
            </div>
        </div>

        {activeTab === 'market' && (
            <>
                {marketData.is_mock && (
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded shadow-sm flex items-start gap-3">
                        <AlertCircle size={20} className="mt-1" />
                        <div><p className="font-bold">Mode Simulasi</p><p className="text-sm">Pasar tutup/Offline.</p></div>
                    </div>
                )}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{(marketData.price || 0).toLocaleString('id-ID')}</h1>
                             <span className={`text-sm font-bold ${marketData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.percent.toFixed(2)}%)
                            </span>
                             <p className="text-gray-500 text-sm mt-1">{symbol.replace('.JK','')} • Market Data</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['1H', '1W', '1M', '3Y'].map((tf) => (
                                <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${timeframe === tf ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500'}`}>{tf}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ReactApexChart options={chartOptions} series={[{ data: marketData.chart }]} type="candlestick" height={350} />
                    </div>
                </div>
            </>
        )}

        {activeTab === 'gainers' && (
             <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Top Movers (IHSG)</h2>
                    <span className="text-xs text-gray-400 italic">Updated from Database Cache</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase"><tr><th className="px-6 py-4">Emiten</th><th className="px-6 py-4 text-right">Harga</th><th className="px-6 py-4 text-right">% Change</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {gainers.map((s, i) => (
                                <tr key={i} className="hover:bg-sky-50 transition cursor-pointer" onClick={()=>{setSymbol(s.symbol); setActiveTab('screener'); fetchAiAnalysis();}}>
                                    <td className="px-6 py-4 font-bold">{s.symbol}</td>
                                    <td className="px-6 py-4 text-right">{s.price.toLocaleString()}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${s.change>=0?'text-green-600':'text-red-600'}`}>{s.percent.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        )}

        {activeTab === 'screener' && aiData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {prediction && !prediction.error ? (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 opacity-10"><BrainCircuit size={150}/></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 opacity-80">
                                <BrainCircuit size={18}/>
                                <h3 className="font-bold uppercase tracking-wider text-xs">AI Prediction (T+1)</h3>
                            </div>

                            <div className="mb-6 border-b border-white/20 pb-4">
                                <h1 className="text-3xl font-extrabold tracking-tight">{prediction.symbol}</h1>
                                <p className="text-indigo-100 text-sm font-medium">{prediction.company_name}</p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                                <div>
                                    <p className="text-indigo-200 text-xs mb-1 uppercase font-bold">Current Price</p>
                                    <div className="text-3xl font-mono font-bold">{prediction.current_price.toLocaleString()}</div>
                                </div>
                                
                                <div className="hidden md:block pb-2">
                                    <ArrowUp className={`animate-bounce w-8 h-8 ${prediction.signal === 'BULLISH' ? 'rotate-90 text-green-300' : 'rotate-90 scale-y-[-1] text-red-300'}`} />
                                </div>
                                
                                <div>
                                    <p className="text-indigo-200 text-xs mb-1 uppercase font-bold">AI Target Price</p>
                                    <div className="text-4xl font-extrabold font-mono text-white drop-shadow-md">
                                        {prediction.predicted_price.toLocaleString()}
                                    </div>
                                    <div className={`text-sm font-bold mt-1 ${prediction.signal === 'BULLISH' ? 'text-green-300' : 'text-red-300'} flex items-center gap-1`}>
                                        {prediction.signal === 'BULLISH' ? '▲' : '▼'} {prediction.change_percent}% ({prediction.signal})
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block mb-1 backdrop-blur-sm">
                                        Akurasi Model: <strong>{prediction.confidence_accuracy}%</strong>
                                    </div>
                                    <p className="text-[10px] opacity-60">Algo: {prediction.method}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded shadow-sm flex items-center gap-3">
                        <AlertCircle className="text-gray-500" />
                        <div>
                            <p className="font-bold text-gray-700">AI Belum Tersedia</p>
                            <p className="text-sm text-gray-600">Data historis saham ini kurang lengkap untuk prediksi Neural Network.</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md
                            ${aiData.verdict_color === 'green' ? 'bg-green-500' : aiData.verdict_color === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                            {aiData.score}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">TECHNICAL SCORE: {aiData.verdict}</h2>
                            <p className="text-gray-500 text-sm">Based on Technical Analysis (RSI, MACD, MA)</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        {aiData.reasons.map((r, i) => (
                            <span key={i} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">{r}</span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-700">
                            <TrendingUp size={20}/>
                            <h3 className="font-bold">Indikator Teknikal</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Momentum</p>
                                <StatRow label="RSI (14)" value={aiData.technical.RSI} />
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500 text-sm">Stochastic (K/D)</span>
                                    <span className="font-bold text-gray-800">
                                        {aiData.technical.Stoch_K} / <span className="text-gray-400">{aiData.technical.Stoch_D}</span>
                                    </span>
                                </div>
                                <StatRow label="MACD" value={aiData.technical.MACD} />
                            </div>

                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Volatilitas (Bollinger)</p>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500 text-sm">Upper Band</span>
                                    <span className="font-bold text-red-600">{aiData.technical.BB_Upper.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-gray-500 text-sm">Lower Band</span>
                                    <span className="font-bold text-green-600">{aiData.technical.BB_Lower.toLocaleString()}</span>
                                </div>
                                <StatRow label="ATR (Risk)" value={aiData.technical.ATR.toLocaleString()} />
                            </div>

                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Key Levels (20 Hari)</p>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-green-600 text-sm font-medium">Support (Beli)</span>
                                    <span className="font-bold text-gray-800">{aiData.technical.Support.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-red-600 text-sm font-medium">Resistance (Jual)</span>
                                    <span className="font-bold text-gray-800">{aiData.technical.Resistance.toLocaleString()}</span>
                                </div>
                                <StatRow label="Pivot Point" value={aiData.technical.Pivot.toLocaleString()} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-6">
                         <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-gray-700"><Activity size={20}/><h3 className="font-bold">Bandarmology Flow (Dummy)</h3></div>
                            <span className={`px-3 py-1 rounded text-xs font-bold text-white ${aiData.bandarmology.status.includes('AKUMULASI') ? 'bg-green-600' : 'bg-red-600'}`}>
                                {aiData.bandarmology.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-sm font-bold text-green-700 mb-3 border-b pb-2">TOP BUYER</h4>
                                {aiData.bandarmology.buyers.map((b, i) => (
                                    <div key={i} className="flex justify-between text-sm mb-2">
                                        <span className="font-bold bg-green-100 px-2 rounded text-green-800 w-10 text-center">{b.code}</span>
                                        <div className="text-right"><div className="font-bold">{b.value.toLocaleString()}</div><div className="text-xs text-gray-400">@{b.avg}</div></div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-700 mb-3 border-b pb-2">TOP SELLER</h4>
                                {aiData.bandarmology.sellers.map((s, i) => (
                                    <div key={i} className="flex justify-between text-sm mb-2">
                                        <span className="font-bold bg-red-100 px-2 rounded text-red-800 w-10 text-center">{s.code}</span>
                                        <div className="text-right"><div className="font-bold">{s.value.toLocaleString()}</div><div className="text-xs text-gray-400">@{s.avg}</div></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-3 opacity-75">
                    <ShieldAlert className="text-gray-400 min-w-[20px]" size={20} />
                    <div className="text-xs text-gray-500 leading-relaxed">
                        <strong>DISCLAIMER (PENTING):</strong> Aplikasi ini adalah alat bantu analisis berbasis statistik & kecerdasan buatan (AI). 
                        Data Bandarmology adalah simulasi (dummy) karena keterbatasan akses data real-time Bursa Efek. 
                        Prediksi harga tidak menjamin akurasi 100%. Keputusan investasi sepenuhnya adalah tanggung jawab Anda. 
                        Gunakan aplikasi ini sebagai referensi pendukung (Second Opinion), bukan penentu utama.
                    </div>
                </div>
            </div>
        )}

        {/* --- 4. TAB HIDDEN GEMS (NEW FITUR) --- */}
        {activeTab === 'gems' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Gem className="text-purple-600" /> Hidden Gems Scanner
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Saham dengan Fundamental Sehat (Valuasi Murah & Profitable) yang lolos filter.
                    </p>
                </div>

                {loading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {[1,2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>)}
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {gems.map((gem, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-gray-900">{gem.symbol}</h3>
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                                                Undervalued
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate max-w-[200px]">{gem.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-mono font-bold text-gray-800">{gem.price.toLocaleString()}</div>
                                        <span className="text-xs text-gray-400">Current Price</span>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1">PER</p>
                                        <p className={`text-lg font-bold ${gem.fundamental.PER < 10 ? 'text-green-600' : 'text-gray-700'}`}>
                                            {gem.fundamental.PER}x
                                        </p>
                                        <p className="text-[10px] text-gray-400">Target: &lt;15x</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1">PBV</p>
                                        <p className={`text-lg font-bold ${gem.fundamental.PBV < 1 ? 'text-green-600' : 'text-sky-600'}`}>
                                            {gem.fundamental.PBV}x
                                        </p>
                                        <p className="text-[10px] text-gray-400">Target: &lt;1.5x</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1">ROE</p>
                                        <p className={`text-lg font-bold ${gem.fundamental.ROE > 15 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {gem.fundamental.ROE}%
                                        </p>
                                        <p className="text-[10px] text-gray-400">Target: &gt;10%</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 flex justify-between items-center group-hover:bg-purple-50 transition-colors">
                                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                        <ShieldAlert size={12}/> Filtered by AI Logic
                                    </span>
                                    <button 
                                        onClick={()=>{setSymbol(gem.symbol); setActiveTab('screener'); fetchAiAnalysis();}}
                                        className="text-sm bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-lg shadow-sm hover:bg-sky-600 hover:text-white hover:border-transparent transition"
                                    >
                                        Analisis Detail →
                                    </button>
                                </div>
                            </div>
                        ))}
                        {gems.length === 0 && (
                             <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                <Gem className="mx-auto text-gray-300 mb-2" size={40} />
                                <p className="text-gray-500">Belum menemukan Hidden Gem di batch scan kali ini.</p>
                                <button onClick={fetchGems} className="mt-2 text-sky-600 font-bold hover:underline">Scan Ulang (Acak)</button>
                             </div>
                        )}
                    </div>
                )}
            </div>
        )}
         
         {activeTab === 'screener' && !aiData && !loading && (
             <div className="text-center py-20 text-gray-400">
                 <Cpu size={48} className="mx-auto mb-4 opacity-50"/>
                 <p>Ketik kode saham di atas (misal: BBRI) untuk memulai analisis AI.</p>
             </div>
         )}

      </main>
    </div>
  );
};

const StatRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-50 pb-2">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="font-bold text-gray-800">{value}</span>
    </div>
);

export default DashboardSaham;