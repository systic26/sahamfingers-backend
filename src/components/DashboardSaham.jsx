import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { 
  AlertCircle, Search, RefreshCw, ArrowUp, Activity, 
  Cpu, TrendingUp, BrainCircuit, ShieldAlert, Clock, 
  Gem, Mail, Info, ShieldCheck, HelpCircle, Layers, Zap, BarChart3, BookOpen
} from 'lucide-react'; 
import Sidebar from './Sidebar';
import AdUnit from './components/AdUnit'; // Pastikan path-nya benar

// --- HALAMAN PANDUAN & EDUKASI (NEW FEATURE) ---
const HelpPage = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3"><BookOpen /> Pusat Edukasi SahamFingers</h2>
          <p className="text-indigo-100">Panduan lengkap memahami Algoritma AI V6.0 dan 30+ Indikator Teknikal yang digunakan.</p>
      </div>

      {/* Bagian 1: Cara Kerja AI */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><BrainCircuit className="text-purple-600"/> Bagaimana AI Bekerja?</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
              AI kami menggunakan model <strong>Gradient Boosting Regressor (GBR)</strong> yang dilatih dengan data historis 5 tahun. 
              Berbeda dengan analisis manusia yang mungkin subjektif, AI ini mempelajari pola dari 25 fitur sekaligus, termasuk harga masa lalu, volume, momentum, dan volatilitas.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 ml-2">
              <li><strong>Target Price:</strong> Estimasi harga penutupan untuk hari esok (T+1).</li>
              <li><strong>Confidence Score:</strong> Tingkat keyakinan AI berdasarkan seberapa mirip pola saat ini dengan masa lalu.</li>
          </ul>
      </div>

      {/* Bagian 2: Kamus Indikator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-indigo-700 mb-4 border-b pb-2">1. Momentum & Tren (Arah Harga)</h3>
              <div className="space-y-4">
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">RSI & StochRSI</span>
                      <span className="text-gray-500">Mengukur jenuh beli/jual. Angka &lt;30 artinya harga sudah terlalu murah (Oversold), &gt;70 terlalu mahal.</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">MACD & AO</span>
                      <span className="text-gray-500">Mendeteksi perubahan arah tren. Jika positif/hijau, tren sedang naik (Bullish).</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Aroon & ADX</span>
                      <span className="text-gray-500">ADX mengukur "kekuatan" tren. Aroon mendeteksi awal mula tren baru.</span>
                  </div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-emerald-700 mb-4 border-b pb-2">2. Volume & Arus Uang (Bandar)</h3>
              <div className="space-y-4">
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Money Flow Index (MFI)</span>
                      <span className="text-gray-500">Seperti RSI tapi pakai Volume. Mendeteksi "Smart Money" yang masuk/keluar diam-diam.</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Chaikin Money Flow (CMF)</span>
                      <span className="text-gray-500">Indikator institusi. Jika CMF positif, artinya Bandar sedang Akumulasi (belanja).</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Accumulation/Distribution (ADI)</span>
                      <span className="text-gray-500">Mengukur tekanan beli vs jual berdasarkan volume penutupan harga.</span>
                  </div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-orange-700 mb-4 border-b pb-2">3. Volatilitas & Risiko</h3>
              <div className="space-y-4">
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Bollinger Bands & Keltner</span>
                      <span className="text-gray-500">Pita pergerakan harga. Jika harga tembus pita atas, itu sinyal Breakout kuat.</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Ulcer Index</span>
                      <span className="text-gray-500">Mengukur tingkat "stress" atau risiko penurunan harga. Semakin rendah semakin aman.</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Mass Index</span>
                      <span className="text-gray-500">Mendeteksi pembalikan arah (Reversal) ketika range harga melebar tidak wajar.</span>
                  </div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">4. Support & Resistance</h3>
              <div className="space-y-4">
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Pivot Point</span>
                      <span className="text-gray-500">Titik tengah keseimbangan harga hari ini. Di atas Pivot = Bullish.</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Ichimoku Cloud</span>
                      <span className="text-gray-500">Area "Awan". Jika harga di atas awan, tren sangat positif. Awan juga berfungsi sebagai support kuat.</span>
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-gray-800 block">Parabolic SAR</span>
                      <span className="text-gray-500">Titik-titik yang mengejar harga. Biasa digunakan untuk menentukan titik Stop Loss.</span>
                  </div>
              </div>
          </div>

      </div>
  </div>
);

// --- KOMPONEN LEGAL LAINNYA ---
const AboutPage = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <Info className="text-sky-600" /> About SahamFingers
    </h2>
    <p className="text-gray-600 leading-relaxed">
      SahamFingers adalah sistem analisis kuantitatif berstandar institusi. Platform ini memadukan Hybrid Gradient Boosting dengan lebih dari 30 indikator teknikal terkurasi. Sistem ini membaca struktur pasar secara menyeluruh. Fokus pada probabilitas pergerakan harga, aliran likuiditas, dan jejak aktivitas institusi. Dirancang untuk pengambilan keputusan yang presisi, cepat, dan berbasis data.
    </p>
  </div>
);

const ContactPage = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex items-center gap-6 animate-in fade-in">
    <div className="bg-sky-100 p-5 rounded-full text-sky-600"><Mail size={40}/></div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Hubungi Kami</h2>
      <p className="text-gray-500 font-medium">Email: sahamfingers@gmail.com</p>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-sm animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      <ShieldCheck className="text-sky-600" /> Privacy Policy
    </h2>
    <p className="text-gray-600">Berikut versi yang lebih panjang, formal, dan profesional. Siap dipakai langsung di aplikasi Anda.

Data, informasi, dan hasil analisis yang disajikan dalam platform ini disediakan sebagaimana adanya dan sebagaimana tersedia. Seluruh konten ditujukan untuk tujuan edukasi, riset, dan pengembangan wawasan pengguna terkait pasar modal dan instrumen keuangan. Kami tidak memberikan jaminan, baik secara tersurat maupun tersirat, atas keakuratan, kelengkapan, ketepatan waktu, maupun relevansi data yang ditampilkan.

Platform ini tidak dimaksudkan sebagai nasihat investasi, rekomendasi pembelian atau penjualan efek, maupun ajakan dalam bentuk apa pun. Setiap keputusan investasi sepenuhnya menjadi tanggung jawab pengguna. Pengguna disarankan untuk melakukan analisis tambahan dan berkonsultasi dengan penasihat keuangan berlisensi sebelum mengambil keputusan finansial.

Kami berkomitmen untuk menjaga keamanan dan kerahasiaan data pengguna sesuai dengan ketentuan peraturan perundang-undangan yang berlaku. Data pengguna tidak akan diperjualbelikan atau dibagikan kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum atau otoritas yang berwenang. Dengan menggunakan platform ini, pengguna dianggap telah memahami dan menyetujui seluruh ketentuan dalam kebijakan privasi ini.
</p>
  </div>
);

const fmt = (val) => (val ? val.toLocaleString('id-ID', { maximumFractionDigits: 2 }) : "0");

const DashboardSaham = () => {
  const [activeTab, setActiveTab] = useState('market'); 
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [symbol, setSymbol] = useState('BBCA'); 
  const [searchInput, setSearchInput] = useState('');
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(true);
  
  const API_BASE = "http://127.0.0.1:5000/api"; 

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
    setPrediction(null); 
    setAiData(null);     
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
    <div className="flex min-h-screen bg-slate-50 font-sans text-gray-700">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 md:ml-64">
        
        <div className="flex justify-between items-center mb-6 gap-4">
            <div className="relative w-full max-w-md flex gap-2">
                <div className="relative w-full">
                    <input 
                        type="text" placeholder={activeTab === 'screener' ? "Analisis V6.0 (contoh: BBCA)..." : "Cari emiten..."}
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
                <div className="bg-sky-600 text-white px-4 py-2 rounded font-mono shadow-sm font-bold">
                    {currentTime.toLocaleTimeString('id-ID')} WIB
                </div>
            </div>
        </div>

        {/* --- IKLAN ADSENSE UTAMA (Global) --- */}
        {/* Unit iklan ini akan muncul di semua tab, tepat di bawah header */}
        <div className="mb-6">
            <AdUnit slotId="5236520310" />
 {/* Ganti ID ini dengan data-ad-slot dari akun AdSense lo nanti */}
        </div>

        {activeTab === 'market' && (
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
        )}

        {activeTab === 'gainers' && (
             <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-800">Top Movers</h2></div>
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

        {/* --- TAB AI SCREENER (GOD MODE UI) --- */}
        {activeTab === 'screener' && aiData && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {prediction && !prediction.error ? (
                    <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 rounded-xl shadow-xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10"><BrainCircuit size={200}/></div>
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 opacity-90 text-sm font-bold tracking-widest"><BrainCircuit size={16}/> GOD MODE PREDICTION (T+1)</div>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-1">{prediction.symbol}</h1>
                                <p className="text-indigo-100 font-medium mb-6">{prediction.company_name}</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <p className="text-xs text-indigo-200 font-bold uppercase">Current Price</p>
                                        <p className="text-2xl font-mono font-bold">{fmt(prediction.current_price)}</p>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-md border border-white/30">
                                        <p className="text-xs text-white font-bold uppercase">AI Target Price</p>
                                        <p className="text-2xl font-mono font-bold text-yellow-300">{fmt(prediction.predicted_price)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end items-end text-right">
                                <div className={`text-2xl font-bold mb-2 flex items-center gap-2 ${prediction.signal === 'BULLISH' ? 'text-green-300' : 'text-red-300'}`}>
                                    {prediction.signal === 'BULLISH' ? <ArrowUp size={32} /> : <ArrowUp size={32} className="rotate-180" />}
                                    {prediction.signal}
                                </div>
                                <div className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full mb-1">
                                    Potensi: {prediction.signal === 'BULLISH' ? '+' : ''}{prediction.change_percent}%
                                </div>
                                <p className="text-[10px] opacity-70">Model: {prediction.method} | Accuracy: {prediction.confidence_accuracy}%</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 p-6 rounded-xl flex items-center gap-4"><AlertCircle className="text-gray-400"/> Data historis tidak cukup untuk prediksi AI.</div>
                )}

                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-lg
                                ${aiData.verdict_color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                                  aiData.verdict_color === 'red' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'}`}>
                                {aiData.score}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">TECHNICAL SCORE: {aiData.verdict}</h2>
                                <p className="text-gray-500 text-sm">Kesimpulan dari 30+ Indikator (Trend, Momentum, Volatility)</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end max-w-lg">
                            {aiData.reasons.map((r, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Zap size={10} className="text-yellow-500"/> {r}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4 text-indigo-700 border-b border-indigo-50 pb-2">
                            <Activity size={18}/><h3 className="font-bold text-sm uppercase">1. Momentum & Osc</h3>
                        </div>
                        <div className="space-y-3">
                            <StatRow label="RSI (14)" value={aiData.technical.RSI} hint="<30 Oversold, >70 Overbought"/>
                            <StatRow label="Stoch RSI" value={aiData.technical.Stoch_RSI} hint="Versi sensitif RSI"/>
                            <StatRow label="Stochastic (K)" value={aiData.technical.Stoch_K} />
                            <StatRow label="Williams %R" value={aiData.technical.Williams} hint="Deteksi pembalikan cepat"/>
                            <StatRow label="Ultimate Osc" value={aiData.technical.Ult_Osc} hint="Gabungan 3 timeframe"/>
                            <StatRow label="PPO" value={aiData.technical.PPO} hint="Persentase Price Oscillator"/>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4 text-emerald-700 border-b border-emerald-50 pb-2">
                            <TrendingUp size={18}/><h3 className="font-bold text-sm uppercase">2. Trend & Cycle</h3>
                        </div>
                        <div className="space-y-3">
                            <StatRow label="MACD" value={aiData.technical.MACD} />
                            <StatRow label="ADX (Strength)" value={aiData.technical.ADX} hint=">25 Tren Kuat"/>
                            <StatRow label="Aroon Up" value={aiData.technical.Aroon_Up} hint="Kekuatan Bullish"/>
                            <StatRow label="Awesome Osc (AO)" value={aiData.technical.AO} />
                            <StatRow label="CCI (Cycle)" value={aiData.technical.CCI} hint="Deteksi Siklus Harga"/>
                            <StatRow label="TRIX (Smoothed)" value={aiData.technical.TRIX} hint="Momentum anti-noise"/>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4 text-blue-700 border-b border-blue-50 pb-2">
                            <BarChart3 size={18}/><h3 className="font-bold text-sm uppercase">3. Volume & Flow</h3>
                        </div>
                        <div className="space-y-3">
                            <StatRow label="Money Flow (MFI)" value={aiData.technical.MFI} hint="RSI tapi pakai Volume"/>
                            <StatRow label="Chaikin Money (CMF)" value={aiData.technical.CMF} hint="Aliran uang institusi"/>
                            <StatRow label="Acc/Dist (ADI)" value={aiData.technical.ADI} hint="Akumulasi vs Distribusi"/>
                            <StatRow label="Force Index" value={aiData.technical.FI} hint="Tenaga pergerakan"/>
                            <StatRow label="Ease of Movement" value={aiData.technical.EOM} />
                            <StatRow label="Volume Price Trend" value={aiData.technical.VPT} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4 text-orange-700 border-b border-orange-50 pb-2">
                            <Layers size={18}/><h3 className="font-bold text-sm uppercase">4. Volatility & Risk</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                                <span className="text-xs text-gray-500">Bollinger Bands</span>
                                <span className="text-xs font-mono font-bold">{fmt(aiData.technical.BB_Lower)} - {fmt(aiData.technical.BB_Upper)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                                <span className="text-xs text-gray-500">Keltner Channel</span>
                                <span className="text-xs font-mono font-bold text-blue-600">{fmt(aiData.technical.KC_Upper)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                                <span className="text-xs text-gray-500">Donchian High</span>
                                <span className="text-xs font-mono font-bold text-purple-600">{fmt(aiData.technical.Donchian_High)}</span>
                            </div>
                            <StatRow label="ATR (Volatility)" value={aiData.technical.ATR} />
                            <StatRow label="Mass Index" value={aiData.technical.Mass_Index} hint=">27 Awas Reversal"/>
                            <StatRow label="Ulcer Index (Risk)" value={aiData.technical.Ulcer_Index} hint="Tingkat Stress Saham"/>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4 text-gray-700 border-b border-gray-50 pb-2">
                            <ShieldCheck size={18}/><h3 className="font-bold text-sm uppercase">5. Key Levels</h3>
                        </div>
                        <div className="space-y-3">
                            <StatRow label="EMA (20) Trend" value={fmt(aiData.technical.EMA_20)} />
                            <StatRow label="KAMA (Smart MA)" value={fmt(aiData.technical.KAMA)} hint="Adaptive Moving Average"/>
                            <StatRow label="Parabolic SAR" value={fmt(aiData.technical.PSAR)} hint="Trailing Stop Loss"/>
                            <StatRow label="Pivot Point" value={fmt(aiData.technical.Pivot)} />
                            <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                <span className="text-xs text-green-600 font-bold">Support</span>
                                <span className="text-sm font-mono font-bold">{fmt(aiData.technical.Support)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-1">
                                <span className="text-xs text-red-600 font-bold">Resistance</span>
                                <span className="text-sm font-mono font-bold">{fmt(aiData.technical.Resistance)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                            <div className="flex items-center gap-2 text-purple-700"><Activity size={18}/><h3 className="font-bold text-sm uppercase">6. Bandarmology</h3></div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${aiData.bandarmology.status.includes('AKUMULASI') ? 'bg-green-600' : aiData.bandarmology.status.includes('DISTRIBUSI') ? 'bg-red-600' : 'bg-yellow-500'}`}>
                                {aiData.bandarmology.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-green-700 mb-2 uppercase">Top Buyer</h4>
                                {aiData.bandarmology.buyers.map((b, i) => (
                                    <div key={i} className="flex justify-between text-xs mb-1">
                                        <span className="font-bold bg-green-50 px-1 rounded text-green-700">{b.code}</span>
                                        <div className="text-right"><span className="font-mono">{b.value.toLocaleString()}</span></div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-red-700 mb-2 uppercase">Top Seller</h4>
                                {aiData.bandarmology.sellers.map((s, i) => (
                                    <div key={i} className="flex justify-between text-xs mb-1">
                                        <span className="font-bold bg-red-50 px-1 rounded text-red-700">{s.code}</span>
                                        <div className="text-right"><span className="font-mono">{s.value.toLocaleString()}</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 italic text-center">Data broker adalah simulasi statistik.</p>
                    </div>

                </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 opacity-90">
                    <ShieldAlert className="text-yellow-600 min-w-[20px]" size={20} />
                    <div className="text-xs text-yellow-800 leading-relaxed">
                        <strong>DISCLAIMER:</strong> "God Mode" adalah istilah algoritma. Tidak menjamin profit 100%. 
                        Sinyal teknikal harus dikombinasikan dengan manajemen risiko yang ketat. 
                        Keputusan investasi sepenuhnya tanggung jawab Anda.
                    </div>
                </div>
            </div>
        )}

        {/* --- TAB HIDDEN GEMS --- */}
        {activeTab === 'gems' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {gems.map((gem, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 px-3 py-1 rounded-bl-lg text-xs font-bold">GEM #{i+1}</div>
                        <div className="flex justify-between mb-4"><h3 className="text-xl font-bold">{gem.symbol}</h3><span className="text-green-600 font-bold">{fmt(gem.price)}</span></div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                            <div className="bg-gray-50 p-2 rounded"><p className="text-[10px] text-gray-400 font-bold">PER</p><p className="font-bold text-gray-800">{gem.fundamental.PER}x</p></div>
                            <div className="bg-gray-50 p-2 rounded"><p className="text-[10px] text-gray-400 font-bold">PBV</p><p className="font-bold text-gray-800">{gem.fundamental.PBV}x</p></div>
                            <div className="bg-gray-50 p-2 rounded"><p className="text-[10px] text-gray-400 font-bold">ROE</p><p className="font-bold text-green-600">{gem.fundamental.ROE}%</p></div>
                        </div>
                        <button onClick={()=>{setSymbol(gem.symbol); setActiveTab('screener'); fetchAiAnalysis();}} className="w-full text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Analisis AI →</button>
                    </div>
                ))}
                {gems.length === 0 && <div className="col-span-full text-center py-10 text-gray-400">Sedang memindai pasar...</div>}
            </div>
        )}

        {/* --- RENDER HALAMAN LAIN (HELP & LEGAL) --- */}
        {activeTab === 'help' && <HelpPage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'privacy' && <PrivacyPage />}
          
        {activeTab === 'screener' && !aiData && !loading && (
             <div className="text-center py-20 text-gray-400">
                 <Cpu size={64} className="mx-auto mb-4 opacity-30 text-indigo-300"/>
                 <h3 className="text-lg font-bold text-gray-500">AI System Ready</h3>
                 <p className="text-sm">Ketik kode saham di atas untuk mengaktifkan "Mode Analysis".</p>
             </div>
        )}

      </main>
    </div>
  );
};

const StatRow = ({ label, value, hint }) => (
    <div className="flex justify-between border-b border-gray-50 pb-1 items-center group cursor-help relative">
        <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 group-hover:text-gray-800 transition">{label}</span>
            {hint && <HelpCircle size={10} className="text-gray-300 group-hover:text-sky-500"/>}
        </div>
        <span className="text-sm font-mono font-bold text-gray-800">{value}</span>
        {hint && (
            <div className="absolute left-0 bottom-full mb-1 w-32 bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-20">
                {hint}
            </div>
        )}
    </div>
);

export default DashboardSaham;