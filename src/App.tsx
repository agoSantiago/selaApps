import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Clock, Zap, History, CheckCircle2, AlertCircle, RefreshCw, Check } from 'lucide-react';

type Duration = 5 | 15 | 30;
type Energy = 'Rendah' | 'Sedang' | 'Tinggi';

interface HistoryItem {
  id: string;
  activity: string;
  duration: Duration;
  timestamp: number;
}

const DATASET: Record<string, string> = {
  "5-Rendah": "Minum segelas air putih dan pejamkan mata.",
  "5-Sedang": "Lakukan peregangan ringan pada leher dan pergelangan tangan.",
  "5-Tinggi": "Rapikan meja kerjamu.",
  "15-Rendah": "Istirahatkan mata sambil mendengarkan musik instrumental hangat.",
  "15-Sedang": "Baca 2 halaman buku favoritmu, atau dengarkan 1 lagu instrumental.",
  "15-Tinggi": "Balas pesan ringan yang tertunda atau perbarui to-do list.",
  "30-Rendah": "Lakukan power nap (tidur ringan) atau meditasi relaksasi.",
  "30-Sedang": "Seduh teh/kopi dan nikmati perlahan tanpa melihat layar ponsel.",
  "30-Tinggi": "Lakukan jalan kaki ringan di sekitar rumah atau kantor."
};

const DURATIONS: Duration[] = [5, 15, 30];
const ENERGIES: Energy[] = ['Rendah', 'Sedang', 'Tinggi'];

export default function App() {
  const [duration, setDuration] = useState<Duration | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [suggestedActivity, setSuggestedActivity] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('sela_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sela_history', JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save history", err);
    }
  }, [history]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleSearch = () => {
    if (!duration || !energy) {
      setErrorMsg("Mohon pilih durasi dan tingkat engergi Anda terlebih dahulu.");
      return;
    }

    setErrorMsg(null);
    const key = `${duration}-${energy}`;
    // Fallback if missing combination
    const activity = DATASET[key] || "Tarik napas dalam, pejamkan mata, dan rileks sejenak.";
    setSuggestedActivity(activity);
  };

  const handleComplete = () => {
    if (!suggestedActivity || !duration) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      activity: suggestedActivity,
      duration: duration,
      timestamp: Date.now()
    };

    setHistory(prev => [newItem, ...prev]);
    setSuggestedActivity(null);
    setDuration(null);
    setEnergy(null);
  };

  const handleReset = () => {
    setSuggestedActivity(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-teal-100 selection:text-teal-900 pb-12">
      {/* Toast Error Notification */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 flex items-center gap-3 bg-red-50 text-red-600 border border-red-200 shadow-md py-3 px-5 rounded-full text-sm font-medium w-max max-w-[90vw]"
          >
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-xl mx-auto px-4 pt-12 md:pt-20">

        {/* Header section */}
        <header className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 bg-teal-50 rounded-2xl mb-4 text-teal-600"
          >
            <Leaf className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-3"
          >
            Sela
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 font-medium text-lg leading-relaxed"
          >
            Ubah sela waktumu jadi lebih bermakna.
          </motion.p>
        </header>

        <section className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 mb-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!suggestedActivity ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-8"
              >
                {/* Duration Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-stone-600">
                    <Clock className="w-4 h-4" />
                    <span>Waktu yang Tersedia</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {DURATIONS.map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border ${duration === d
                            ? 'bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500 shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-teal-300 hover:bg-stone-50'
                          }`}
                      >
                        {d} Menit
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-stone-600">
                    <Zap className="w-4 h-4" />
                    <span>Sisa Energi Saat Ini</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {ENERGIES.map(e => (
                      <button
                        key={e}
                        onClick={() => setEnergy(e)}
                        className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all duration-200 border ${energy === e
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500 shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-stone-50'
                          }`}
                      >
                        <span>
                          {e} <span className="opacity-70 ml-1 font-normal">
                            {e === 'Rendah' ? '(Butuh Istirahat)' : e === 'Sedang' ? '(Santai)' : '(Produktif Ringan)'}
                          </span>
                        </span>
                        {energy === e && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Action */}
                <button
                  onClick={handleSearch}
                  className="mt-2 w-full flex justify-center items-center py-4 bg-stone-900 text-white rounded-xl font-medium shadow-md shadow-stone-900/10 hover:bg-stone-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  Cari Aktivitas
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center py-6 px-2 text-center"
              >
                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                  <Leaf className="w-8 h-8 text-teal-600" />
                </div>

                <div className="flex gap-2 items-center text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4 border border-stone-200 px-3 py-1 rounded-full">
                  <span>{duration} Menit</span>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span>Energi {energy}</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-10 leading-tight">
                  {suggestedActivity}
                </h2>

                <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3.5 px-4 rounded-xl font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all flex justify-center items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Batal
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex-[2] py-3.5 px-4 rounded-xl font-medium text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-md flex justify-center items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Selesai & Catat
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* History Section */}
        {history.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-stone-800 font-semibold mb-4 pl-1">
              <History className="w-5 h-5 opacity-70" />
              <h3>Riwayat Hari Ini</h3>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-2 shadow-sm">
              <ul className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="flex p-3 rounded-xl hover:bg-stone-50 transition-colors items-start gap-4 border border-transparent hover:border-stone-100"
                  >
                    <div className="mt-0.5 rounded-full p-1 bg-stone-100 text-teal-600 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-800 text-sm font-medium leading-snug pr-4">
                        {item.activity}
                      </p>
                      <p className="text-stone-400 text-xs mt-1">
                        Selesai ({item.duration} Menit)
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

      </main>
    </div>
  );
}
