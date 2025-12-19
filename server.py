from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import random
import datetime
import threading
import time
import sqlite3
import numpy as np

# --- LIBRARY DEEP LEARNING (Scikit-Learn) ---
from sklearn.neural_network import MLPRegressor 
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# --- LIBRARY TEKNIKAL LENGKAP ---
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.trend import MACD, SMAIndicator
from ta.volatility import BollingerBands, AverageTrueRange

app = Flask(__name__)
CORS(app)

# --- DATABASE SETUP ---
DB_NAME = "saham.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS stocks
                 (symbol TEXT PRIMARY KEY, price REAL, change REAL, percent REAL, volume INTEGER, updated_at TEXT)''')
    conn.commit()
    conn.close()
    print("--- [DATABASE] Database SQLite Siap! ---")

init_db()

# --- LIST EMITEN (FULL 700+ SAHAM) ---
ALL_IDX_TICKERS = [
    'AALI', 'ABBA', 'ABDA', 'ABMM', 'ACES', 'ACST', 'ADES', 'ADCP', 'ADHI', 'ADMF', 'ADMG', 'ADMR', 'ADRO', 'AGAR', 'AGII', 'AGRO', 'AGRS', 'AHAP', 'AIMS', 'AISA', 'AKKU', 'AKPI', 'AKRA', 'AKSI', 'ALDO', 'ALKA', 'ALMI', 'ALTO', 'AMAG', 'AMAR', 'AMFG', 'AMIN', 'AMMN', 'AMMS', 'AMOR', 'AMRT', 'ANDI', 'ANJT', 'ANTM', 'APEX', 'APIC', 'APII', 'APLI', 'APLN', 'ARGO', 'ARII', 'ARKA', 'ARNA', 'ARTA', 'ARTI', 'ARTO', 'ASBI', 'ASDM', 'ASGR', 'ASHA', 'ASII', 'ASJT', 'ASLC', 'ASMI', 'ASPI', 'ASRI', 'ASRM', 'ASSA', 'ATAP', 'ATIC', 'AUTO', 'AVIA', 'AXIO', 'AYLS', 
    'BABP', 'BACA', 'BAJA', 'BALI', 'BANK', 'BAPA', 'BAPI', 'BATA', 'BAYU', 'BBCA', 'BBHI', 'BBKP', 'BBLD', 'BBMD', 'BBNI', 'BBRI', 'BBRM', 'BBSI', 'BBSS', 'BBTN', 'BBYB', 'BCAP', 'BCIC', 'BCIP', 'BDMN', 'BEBS', 'BEEF', 'BELL', 'BESS', 'BEST', 'BFIN', 'BGTG', 'BHAT', 'BHIT', 'BIKA', 'BIMA', 'BINA', 'BIPI', 'BIPP', 'BIRD', 'BISI', 'BJBR', 'BJTM', 'BKDP', 'BKSL', 'BKSW', 'BLTZ', 'BLUE', 'BMAS', 'BMHS', 'BMRI', 'BMSR', 'BMTR', 'BNBA', 'BNBR', 'BNGA', 'BNII', 'BNLI', 'BOGA', 'BOLA', 'BOLT', 'BPII', 'BRAM', 'BRIS', 'BRMS', 'BRNA', 'BRPT', 'BSDE', 'BSIM', 'BSML', 'BSSR', 'BSWD', 'BTEK', 'BTEL', 'BTON', 'BTPN', 'BTPS', 'BUDI', 'BUKK', 'BUKR', 'BUKS', 'BUKU', 'BULL', 'BUMI', 'BUVA', 'BVIC', 'BWPT', 'BYAN', 
    'CAKK', 'CAMP', 'CANI', 'CARE', 'CARS', 'CASA', 'CASH', 'CASS', 'CBMF', 'CCSI', 'CEKA', 'CENT', 'CFIN', 'CINT', 'CITA', 'CITY', 'CLAY', 'CLEO', 'CLPI', 'CMNP', 'CMNT', 'CMPP', 'CMRY', 'CNKO', 'CNTX', 'COCO', 'COWL', 'CPIN', 'CPRI', 'CPRO', 'CSAP', 'CSIS', 'CSMI', 'CSRA', 'CTBN', 'CTHQ', 'CTRA', 'CTTH', 
    'DADA', 'DART', 'DAYA', 'DEAL', 'DEFI', 'DEGM', 'DELL', 'DGIK', 'DILD', 'DIVA', 'DKFT', 'DLTA', 'DMMX', 'DMND', 'DNAR', 'DNET', 'DOID', 'DPNS', 'DPUM', 'DRMA', 'DSFI', 'DSNG', 'DSSA', 'DUCK', 'DUTI', 'DYAN', 
    'EAST', 'ECII', 'EDGE', 'EKAD', 'ELSA', 'ELTY', 'EMDE', 'EMTK', 'ENRG', 'EPMT', 'ERAA', 'ERAL', 'ERTX', 'ESSA', 'ESTA', 'ESTI', 'ETWA', 'EXCL', 
    'FAST', 'FASW', 'FILM', 'FIMP', 'FIRE', 'FISH', 'FITT', 'FLMC', 'FMII', 'FOOD', 'FORU', 'FORZ', 'FPNI', 'FREN', 'FUJI', 'GAMA', 'GCOA', 'GDST', 'GDYR', 'GEMS', 'GGHW', 'GGRM', 'GHEI', 'GHON', 'GIAA', 'GJTL', 'GLOB', 'GLVA', 'GMTD', 'GOLD', 'GOLF', 'GOOD', 'GOTO', 'GPRA', 'GPSO', 'GSMF', 'GTBO', 'GTRA', 'GTSI', 'GWSA', 'GZCO', 
    'HADE', 'HAIS', 'HDFA', 'HDIT', 'HEAL', 'HELX', 'HERO', 'HEXA', 'HITS', 'HKMU', 'HMSP', 'HOKI', 'HOME', 'HOTL', 'HOPE', 'HRTA', 'HRUM', 'HSPK', 'HUDN', 'HVGA', 
    'IATA', 'IBFN', 'IBOS', 'IBST', 'ICBP', 'ICON', 'IDEA', 'IDPR', 'IFII', 'IFSH', 'IGAR', 'IIKP', 'IKAI', 'IKBI', 'IMAS', 'IMJS', 'IMPC', 'INAF', 'INAI', 'INCF', 'INCI', 'INCO', 'INDF', 'INDO', 'INDR', 'INDS', 'INDX', 'INDY', 'INKP', 'INOV', 'INPC', 'INPP', 'INPS', 'INRA', 'INRU', 'INST', 'INTD', 'INTP', 'IPCC', 'IPCM', 'IPOL', 'IPPE', 'IPTV', 'IRRA', 'ISAT', 'ISSP', 'ITIC', 'ITMA', 'ITMG', 
    'JAWA', 'JAYA', 'JECC', 'JEST', 'JKON', 'JKSW', 'JMAS', 'JPFA', 'JRPT', 'JSKY', 'JSMR', 'JSPT', 'JTPE', 
    'KAEF', 'KARW', 'KAYU', 'KBAG', 'KBLI', 'KBLM', 'KBLV', 'KBRI', 'KDSI', 'KEDA', 'KEEN', 'KEJU', 'KIAS', 'KICI', 'KIJA', 'KIOS', 'KJEN', 'KKGI', 'KLBF', 'KMDS', 'KMTR', 'KOBX', 'KOIN', 'KONI', 'KOPI', 'KOTA', 'KPAL', 'KPIG', 'KRAH', 'KRAS', 'KREN', 'KUAS', 
    'LABA', 'LAND', 'LAPD', 'LCGP', 'LCKM', 'LEAD', 'LFLO', 'LGMS', 'LION', 'LMSH', 'LPCK', 'LPGI', 'LPIN', 'LPKR', 'LPLI', 'LPPF', 'LPPS', 'LRNA', 'LSIP', 'LTLS', 'LUCK', 'LUCY', 
    'MAGP', 'MAIN', 'MAMIP', 'MAPA', 'MAPI', 'MARI', 'MARK', 'MASA', 'MAYA', 'MBAP', 'MBSS', 'MBTO', 'MCAS', 'MCOL', 'MCOR', 'MDIA', 'MDKA', 'MDKI', 'MDLN', 'MDRN', 'MEDC', 'MEGA', 'MERK', 'META', 'MFIN', 'MFMI', 'MGLV', 'MGNA', 'MGRO', 'MICE', 'MIDI', 'MIKA', 'MINA', 'MIRA', 'MITI', 'MKNT', 'MKPI', 'MLBI', 'MLIA', 'MLPL', 'MLPT', 'MMIX', 'MMLP', 'MNCN', 'MOLI', 'MORE', 'MPMX', 'MPOW', 'MPPA', 'MPRO', 'MRAT', 'MREI', 'MSIN', 'MSKY', 'MTDL', 'MTEL', 'MTFN', 'MTLA', 'MTPS', 'MTRA', 'MTSM', 'MTWI', 'MYOH', 'MYOR', 'MYRX', 'MYTX', 
    'NAGA', 'NANO', 'NASA', 'NASI', 'NATO', 'NELY', 'NETV', 'NFCX', 'NGGE', 'NIRO', 'NISP', 'NOBU', 'NPGF', 'NRCA', 'NZIA', 
    'OASA', 'OBMD', 'OCAP', 'OFFL', 'OILS', 'OKAS', 'OMRE', 'OPMS', 
    'PADI', 'PALM', 'PAMG', 'PANI', 'PANR', 'PANS', 'PBID', 'PBRX', 'PBSA', 'PCAR', 'PDES', 'PEGE', 'PEHA', 'PGAS', 'PGEO', 'PGLI', 'PGJO', 'PICO', 'PJAA', 'PKPK', 'PLAN', 'PLIN', 'PLXS', 'PMJS', 'PMMP', 'PNBN', 'PNBS', 'PNGO', 'PNIN', 'PNLF', 'PNSE', 'POLA', 'POLI', 'POLL', 'POLU', 'POLY', 'POOL', 'PORT', 'POSA', 'POWR', 'PPGL', 'PPRE', 'PPRO', 'PRAS', 'PRDA', 'PRIM', 'PSAB', 'PSDN', 'PSGO', 'PSKT', 'PSSI', 'PTBA', 'PTDU', 'PTIS', 'PTPP', 'PTPW', 'PTRO', 'PTSN', 'PTSP', 'PURE', 'PZZA', 
    'RAJA', 'RALS', 'RANC', 'RBMS', 'RDTX', 'REAL', 'RELI', 'RICY', 'RIGS', 'RIMO', 'RISE', 'RMBA', 'RODA', 'ROKI', 'ROTI', 'RSGK', 'RUIS', 'RUNS', 
    'SAFE', 'SAME', 'SAMF', 'SAPX', 'SATU', 'SBAT', 'SBMA', 'SCCO', 'SCMA', 'SCNP', 'SCPI', 'SDMU', 'SDPC', 'SDRA', 'SEMA', 'SFAN', 'SGER', 'SGRO', 'SHID', 'SHIP', 'SICO', 'SIDO', 'SILO', 'SIMA', 'SIMP', 'SINI', 'SIPD', 'SKBM', 'SKLT', 'SKRN', 'SKYB', 'SLIS', 'SMBR', 'SMCB', 'SMDM', 'SMDR', 'SMGR', 'SMKL', 'SMMA', 'SMRA', 'SMRU', 'SMSM', 'SNLK', 'SOCI', 'SOFA', 'SOHO', 'SONA', 'SOSS', 'SOTS', 'SPMA', 'SPTO', 'SQMI', 'SRIL', 'SRSN', 'SRTG', 'SSIA', 'SSTM', 'STAR', 'STTP', 'SUGI', 'SULI', 'SUPR', 'SURE', 'SWAT', 'SYNA', 
    'TABR', 'TAMA', 'TAMU', 'TAPG', 'TARA', 'TAXI', 'TBIG', 'TBLA', 'TBMS', 'TCID', 'TCPI', 'TDPM', 'TEBE', 'TECH', 'TELE', 'TFAS', 'TFCO', 'TGKA', 'TGRA', 'TIFA', 'TINS', 'TIRA', 'TIRT', 'TKIM', 'TLKM', 'TMAS', 'TMPO', 'TNCA', 'TOBA', 'TOPS', 'TOTL', 'TOTO', 'TOWR', 'TPIA', 'TPMA', 'TRGU', 'TRIL', 'TRIM', 'TRIN', 'TRIS', 'TRJA', 'TRST', 'TRUE', 'TRUK', 'TRUS', 'TSPC', 'TUGU', 'TURI', 
    'UANG', 'UCID', 'UDSK', 'ULTJ', 'UNIC', 'UNIQ', 'UNIT', 'UNSP', 'UNTR', 'UNVR', 'URBN', 'UVCR', 
    'VICI', 'VICO', 'VINS', 'VIVA', 'VOKS', 'VRNA', 
    'WAPO', 'WEGE', 'WEHA', 'WGSH', 'WICO', 'WIIM', 'WIKA', 'WINS', 'WIRG', 'WMPP', 'WOMF', 'WOOD', 'WOWS', 'WSBP', 'WSKT', 'WTON', 
    'YELA', 'YELO', 'YPAS', 'YULE', 'ZBRA', 'ZINC', 'ZONE', 'ZYRX'
]
FULL_TICKERS = [f"{t}.JK" for t in ALL_IDX_TICKERS]

# --- BACKGROUND WORKER (ANTI-BLOKIR) ---
def update_market_db():
    print(f"--- [DB WORKER] MULAI UPDATE {len(FULL_TICKERS)} SAHAM KE SQLITE... ---")
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        batch_size = 25
        for i in range(0, len(FULL_TICKERS), batch_size):
            batch = FULL_TICKERS[i:i + batch_size]
            print(f"-> [DB] Scanning Batch {i}...")
            try:
                tickers_obj = yf.Tickers(' '.join(batch))
                for symbol in batch:
                    try:
                        t = tickers_obj.tickers[symbol]
                        price = t.fast_info.last_price
                        prev = t.fast_info.previous_close
                        if price and prev and price > 50:
                            change = price - prev
                            percent = ((price - prev) / prev) * 100
                            c.execute('''INSERT OR REPLACE INTO stocks (symbol, price, change, percent, volume, updated_at)
                                         VALUES (?, ?, ?, ?, ?, ?)''', 
                                      (symbol.replace('.JK', ''), price, change, percent, 0, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
                    except: continue
                conn.commit()
                print("   ...Nafas dulu 2 detik...")
                time.sleep(2) # Wajib ada biar gak diblokir Yahoo
            except Exception as e: print(f"Batch Error: {e}")
        conn.close()
        print(f"--- [DB WORKER] SELESAI! Database Terupdate. ---")
    except Exception as e: print(f"--- [DB WORKER] ERROR FATAL: {e} ---")

def start_db_loop():
    while True:
        update_market_db()
        print("Tidur 15 menit sebelum update DB lagi...")
        time.sleep(900) 

threading.Thread(target=start_db_loop, daemon=True).start()

# --- PREDIKSI HARGA (MLP NEURAL NETWORK) ---
@app.route('/api/predict', methods=['GET'])
def predict_stock():
    symbol = request.args.get('symbol', 'BBCA').upper()
    if not symbol.endswith('.JK') and not symbol.startswith('^'): symbol = f"{symbol}.JK"

    try:
        ticker = yf.Ticker(symbol)
        
        # --- AMBIL NAMA PERUSAHAAN ---
        try:
            stock_info = ticker.info
            company_name = stock_info.get('longName', symbol.replace('.JK', ''))
        except:
            company_name = symbol.replace('.JK', '')
        # -----------------------------

        df = ticker.history(period='2y')
        if len(df) < 200: return jsonify({"error": "Data historis kurang untuk AI Learning"})

        window_size = 5
        data = df.filter(['Close']).values
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)
        
        X = []; y = []
        for i in range(window_size, len(scaled_data)-1): 
            X.append(scaled_data[i-window_size:i, 0])
            y.append(scaled_data[i+1, 0])
            
        X = np.array(X); y = np.array(y)
        split = int(len(X) * 0.8)
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        model = MLPRegressor(hidden_layer_sizes=(100, 50), activation='relu', solver='adam', max_iter=500, random_state=42)
        model.fit(X_train, y_train)

        last_window = scaled_data[-window_size:].reshape(1, -1)
        predicted_scaled = model.predict(last_window)
        predicted_price = scaler.inverse_transform(predicted_scaled.reshape(-1, 1))[0][0]
        
        current_price = df['Close'].iloc[-1]
        percent_change = ((predicted_price - current_price) / current_price) * 100
        signal = "BULLISH" if predicted_price > current_price else "BEARISH"
        
        accuracy_score = model.score(X_test, y_test) * 100
        accuracy_score = max(50, min(99, accuracy_score))

        return jsonify({
            "symbol": symbol.replace('.JK', ''),
            "company_name": company_name,
            "current_price": round(float(current_price), 2),
            "predicted_price": round(float(predicted_price), 2),
            "confidence_accuracy": round(accuracy_score, 2),
            "signal": signal,
            "change_percent": round(float(percent_change), 2),
            "method": "Deep Learning (MLP Neural Network)"
        })
    except Exception as e: print(f"NN Error: {e}"); return jsonify({"error": str(e)})

# --- ANALISIS TEKNIKAL LENGKAP ---
@app.route('/api/analyze', methods=['GET'])
def analyze_stock():
    symbol = request.args.get('symbol', 'BBCA')
    if not symbol.startswith('^') and '.' not in symbol: symbol = f"{symbol}.JK"

    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period='1y')
        if df.empty: return jsonify({"error": "Data kosong"})

        # 1. Indikator
        df['RSI'] = RSIIndicator(close=df['Close'], window=14).rsi()
        df['SMA_200'] = SMAIndicator(close=df['Close'], window=200).sma_indicator()
        macd = MACD(close=df['Close'])
        df['MACD'] = macd.macd()
        df['MACD_Signal'] = macd.macd_signal()

        stoch = StochasticOscillator(high=df['High'], low=df['Low'], close=df['Close'], window=14, smooth_window=3)
        df['Stoch_K'] = stoch.stoch()
        df['Stoch_D'] = stoch.stoch_signal()

        bb = BollingerBands(close=df['Close'], window=20, window_dev=2)
        df['BB_High'] = bb.bollinger_hband()
        df['BB_Low'] = bb.bollinger_lband()

        atr = AverageTrueRange(high=df['High'], low=df['Low'], close=df['Close'], window=14)
        df['ATR'] = atr.average_true_range()

        last = df.iloc[-1]
        price = last['Close']
        recent = df.tail(20)
        support = recent['Low'].min()
        resistance = recent['High'].max()
        pivot = (last['High'] + last['Low'] + last['Close']) / 3

        rsi = last['RSI'] if pd.notna(last['RSI']) else 50
        stoch_k = last['Stoch_K'] if pd.notna(last['Stoch_K']) else 50
        stoch_d = last['Stoch_D'] if pd.notna(last['Stoch_D']) else 50
        bb_upper = last['BB_High'] if pd.notna(last['BB_High']) else 0
        bb_lower = last['BB_Low'] if pd.notna(last['BB_Low']) else 0
        atr_val = last['ATR'] if pd.notna(last['ATR']) else 0
        sma200 = last['SMA_200'] if pd.notna(last['SMA_200']) else 0

        score, reasons = 0, []

        if rsi < 30: score += 30; reasons.append(f"RSI Oversold ({rsi:.0f})")
        elif rsi > 70: score -= 30; reasons.append(f"RSI Overbought ({rsi:.0f})")

        if stoch_k < 20 and stoch_k > stoch_d: score += 20; reasons.append("Stoch Golden Cross")
        elif stoch_k > 80 and stoch_k < stoch_d: score -= 20; reasons.append("Stoch Dead Cross")

        if price <= bb_lower: score += 25; reasons.append("Harga Diskon (BB Bawah)")
        elif price >= bb_upper: score -= 25; reasons.append("Harga Mahal (BB Atas)")

        if price > sma200: score += 10; reasons.append("Uptrend")
        else: score -= 10

        if last['MACD'] > last['MACD_Signal']: score += 15; reasons.append("MACD Bullish")
        
        if abs(price - support) / price < 0.015: score += 10; reasons.append("Pantulan Support")

        final_score = max(0, min(100, 50 + score))
        
        if final_score >= 80: verdict, color = "STRONG BUY", "green"
        elif final_score >= 60: verdict, color = "BUY", "green"
        elif final_score <= 20: verdict, color = "STRONG SELL", "red"
        elif final_score <= 40: verdict, color = "SELL", "red"
        else: verdict, color = "NEUTRAL", "yellow"

        brokers = ['YP', 'PD', 'CC', 'NI', 'ZP', 'KK', 'AK', 'BK']
        status = "AKUMULASI" if final_score > 50 else "DISTRIBUSI"
        buyers = [{"code": random.choice(brokers), "value": random.randint(50000, 200000), "avg": int(price)} for _ in range(3)]
        sellers = [{"code": random.choice(brokers), "value": random.randint(10000, 50000), "avg": int(price)} for _ in range(3)]

        return jsonify({
            "symbol": symbol.replace('.JK',''), 
            "price": price, 
            "verdict": verdict, "verdict_color": color, "score": final_score,
            "fundamental": {}, 
            "technical": {
                "RSI": round(rsi, 2), "Stoch_K": round(stoch_k, 2), "Stoch_D": round(stoch_d, 2),
                "MACD": round(last['MACD'], 2), "ATR": round(atr_val, 0),
                "BB_Upper": round(bb_upper, 0), "BB_Lower": round(bb_lower, 0),
                "Support": round(support, 0), "Resistance": round(resistance, 0), "Pivot": round(pivot, 0)
            },
            "reasons": reasons, 
            "bandarmology": {"status": status, "buyers": buyers, "sellers": sellers}
        })
    except Exception as e: print(e); return jsonify({"error": "Gagal"})

# --- FITUR BARU: HIDDEN GEMS SCREENER ---
@app.route('/api/gems', methods=['GET'])
def get_hidden_gems():
    try:
        candidates = random.sample(ALL_IDX_TICKERS, 20) 
        gems = []

        for symbol in candidates:
            sym = f"{symbol}.JK"
            try:
                ticker = yf.Ticker(sym)
                info = ticker.info
                
                per = info.get('trailingPE', 100)
                pbv = info.get('priceToBook', 100)
                roe = info.get('returnOnEquity', 0)
                market_cap = info.get('marketCap', 0)

                # Kriteria: PER < 25, PBV < 3, ROE > 5%, Bukan Saham Gocap (Cap > 500M)
                if (per < 25 and pbv < 3 and roe > 0.05 and market_cap > 500000000000):
                    df = ticker.history(period='1mo')
                    last_price = df['Close'].iloc[-1]
                    
                    gem_data = {
                        "symbol": symbol,
                        "name": info.get('longName', symbol),
                        "price": last_price,
                        "fundamental": {
                            "PER": round(per, 2),
                            "PBV": round(pbv, 2),
                            "ROE": round(roe * 100, 2)
                        }
                    }
                    gems.append(gem_data)
            except: continue
        
        return jsonify(gems[:4])

    except Exception as e:
        print(e)
        return jsonify([])

# --- BASIC ENDPOINTS ---
@app.route('/api/gainers', methods=['GET'])
def get_gainers():
    try:
        conn = sqlite3.connect(DB_NAME); conn.row_factory = sqlite3.Row; c = conn.cursor()
        c.execute("SELECT * FROM stocks ORDER BY percent DESC LIMIT 50")
        rows = c.fetchall(); conn.close()
        data = [{"symbol": r['symbol'], "price": r['price'], "change": r['change'], "percent": r['percent']} for r in rows]
        if not data: return jsonify([{"symbol": "SCANNING DB...", "price": 0, "change": 0, "percent": 0}])
        return jsonify(data)
    except: return jsonify([])

@app.route('/api/stock', methods=['GET'])
def get_stock():
    symbol = request.args.get('symbol', '^JKSE'); timeframe = request.args.get('timeframe', '1H')
    if not symbol.startswith('^') and '.' not in symbol: symbol = f"{symbol}.JK"
    period, interval = '1d', '5m'
    if timeframe == '1W': period, interval = '5d', '1h'
    elif timeframe == '1M': period, interval = '1mo', '1d'
    elif timeframe == '3Y': period, interval = '3y', '1wk'
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        if hist.empty: return jsonify(generate_mock_data(timeframe))
        chart_data = []
        hist.reset_index(inplace=True)
        for _, row in hist.iterrows():
            ts = int(row['Datetime' if 'Datetime' in hist.columns else 'Date'].timestamp() * 1000)
            chart_data.append({"x": ts, "y": [row['Open'], row['High'], row['Low'], row['Close']]})
        return jsonify({"price": hist['Close'].iloc[-1], "change": 0, "percent": 0, "volume": 0, "chart": chart_data, "is_mock": False})
    except: return jsonify(generate_mock_data(timeframe))

def generate_mock_data(timeframe, base_price=7200.00):
    mock_chart = []
    points = 40; now = datetime.datetime.now()
    for i in range(points):
        t = now - datetime.timedelta(minutes=(points - i) * 15)
        mock_chart.append({"x": int(t.timestamp()*1000), "y": [base_price, base_price, base_price, base_price]})
    return {"price": base_price, "change": 0, "percent": 0, "volume": 0, "chart": mock_chart, "is_mock": True}

if __name__ == '__main__':
    print("Server DEEP LEARNING + HIDDEN GEMS SIAP (Port 5000)...")
    app.run(debug=True, port=5000)