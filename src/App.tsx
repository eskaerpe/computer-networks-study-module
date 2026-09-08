import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  BookOpen, 
  HelpCircle, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

const quizData: Question[] = [
  {
    id: 1,
    question: "Karakteristik efektivitas komunikasi data yang mengukur variasi dalam waktu kedatangan paket data disebut...",
    options: ["Accuracy", "Delivery", "Jitter", "Timeliness"],
    correct: 2,
    explanation: "Jitter adalah ukuran variasi keterlambatan (delay) kedatangan paket data secara berurutan, yang sangat berpengaruh pada streaming audio/video real-time."
  },
  {
    id: 2,
    question: "Perangkat Switch beroperasi pada lapisan (layer) ke berapa dalam model TCP/IP?",
    options: ["Layer 1 dan Layer 2", "Layer 2 dan Layer 3", "Layer 3 saja", "Layer 1 sampai Layer 5"],
    correct: 0,
    explanation: "Switch standar beroperasi pada Layer 1 (Physical) dan Layer 2 (Data Link) untuk meneruskan frame berdasarkan MAC Address di dalam satu LAN."
  },
  {
    id: 3,
    question: "Unit data protokol (PDU) pada Transport Layer dalam arsitektur TCP/IP dinamakan...",
    options: ["Message", "Frame", "Bits", "Segment / User Datagram"],
    correct: 3,
    explanation: "Pada Transport Layer, data dari Application Layer dibungkus dengan header H4 (Port Addressing) menjadi Segment (TCP) atau User Datagram (UDP)."
  },
  {
    id: 4,
    question: "Berapa jumlah total kabel fisik yang dibutuhkan untuk menghubungkan 6 perangkat dalam topologi Full Mesh?",
    options: ["6 kabel", "10 kabel", "15 kabel", "30 kabel"],
    correct: 2,
    explanation: "Rumus jumlah link fisik topologi Mesh adalah N(N - 1) / 2. Untuk 6 perangkat: (6 * 5) / 2 = 15 kabel."
  },
  {
    id: 5,
    question: "Manakah pernyataan yang BENAR mengenai perbedaan perutean Router vs Switch?",
    options: [
      "Router menggunakan MAC Address antar LAN, Switch menggunakan IP Address",
      "Router beroperasi di Layer 1-3 untuk meneruskan paket antar subnet via IP Address, sedangkan Switch beroperasi di Layer 1-2 via MAC Address",
      "Switch dapat mengarahkan paket ke internet global tanpa membutuhkan Router",
      "Router tidak mengubah header Data Link saat meneruskan paket ke link berikutnya"
    ],
    correct: 1,
    explanation: "Router bekerja hingga Layer 3 (Network) menggunakan logical IP Address untuk routing antar jaringan, sedangkan Switch bekerja di Layer 2 menggunakan physical MAC Address."
  }
];

const flashcardsData: Flashcard[] = [
  {
    id: 1,
    front: "Apa itu Jitter?",
    back: "Variasi dalam waktu kedatangan (delay) antar paket data berurutan yang menyebabkan lag/ketidakteraturan pada transmisi audio/video.",
    category: "Konsep Dasar"
  },
  {
    id: 2,
    front: "Perbedaan Switch vs Router (Layer Operation)",
    back: "Switch bekerja di Layer 1-2 (Physical & Data Link) via MAC Address. Router bekerja di Layer 1-3 (Physical, Data Link & Network) via IP Address.",
    category: "Perangkat Jaringan"
  },
  {
    id: 3,
    front: "PDU Tiap Layer TCP/IP",
    back: "Layer 5 (App) = Message, Layer 4 (Transport) = Segment, Layer 3 (Network) = Packet/Datagram, Layer 2 (Data Link) = Frame, Layer 1 (Physical) = Bits.",
    category: "Protokol & Layering"
  },
  {
    id: 4,
    front: "Rumus Kabel Topologi Mesh",
    back: "Total Link = N(N - 1) / 2. Jumlah port per perangkat = N - 1.",
    category: "Topologi"
  },
  {
    id: 5,
    front: "Mengapa Butuh Protocol Layering?",
    back: "Modularitas dan Separation of Concerns: mempermudah troubleshooting dan memungkinkan perubahan protokol di satu layer tanpa merusak layer lain.",
    category: "Konsep Dasar"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'read' | 'flashcards' | 'quiz'>('read');
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/sesi1.md`)
      .then(res => res.text())
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading markdown:", err);
        setLoading(false);
      });
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === quizData[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcardsData.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length);
    }, 150);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0b0c0e] text-zinc-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/80 dark:bg-[#0b0c0e]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Study Module</span>
              <h1 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Computer Networks (Sesi 01)</h1>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200/60 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('read')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'read'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Materi Baca</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Flashcards</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Kuis Interaktif</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main 3-Column Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar: Session List */}
        <aside className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-[#0b0c0e] border-r border-slate-200 dark:border-zinc-800 p-5 pt-20 md:pt-6 md:static md:block transition-transform duration-200
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">Daftar Modul</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40">
                <span className="truncate">Sesi 01: Intro & TCP/IP</span>
                <ChevronRight size={14} />
              </button>
              <button disabled className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 dark:text-zinc-600 cursor-not-allowed opacity-60">
                <span className="truncate">Sesi 02: Network Layer (Next)</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Target Pembelajaran</h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
              Memahami 5 komponen data comms, 5-layer TCP/IP vs 7-layer OSI, serta fungsi switch vs router.
            </p>
          </div>
        </aside>

        {/* Center Lane: Content Renderer */}
        <main className="flex-1 min-w-0 px-6 py-8 md:px-12 md:py-10">
          {activeTab === 'read' && (
            <div className="max-w-4xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Memuat materi kuliah...</p>
                </div>
              ) : (
                <article className="doc-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {markdown}
                  </ReactMarkdown>
                </article>
              )}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="max-w-xl mx-auto py-10 flex flex-col items-center">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Flashcard Review</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mt-1">Konsep Kunci Jaringan</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Kartu {currentCardIndex + 1} dari {flashcardsData.length} &bull; Klik kartu untuk membalik
                </p>
              </div>

              {/* 3D Flip Card */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-80 cursor-pointer perspective-1000 mb-6 group"
              >
                <div className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d border border-slate-200 dark:border-zinc-800 shadow-xl ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}>
                  {/* Front Side */}
                  <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-2xl p-8 flex flex-col justify-between backface-hidden">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      {flashcardsData[currentCardIndex].category}
                    </span>
                    <div className="text-center my-auto">
                      <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-zinc-100 leading-snug">
                        {flashcardsData[currentCardIndex].front}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-blue-500 dark:text-blue-400 flex items-center justify-center gap-1.5">
                        <RotateCcw size={13} /> Klik untuk lihat jawaban
                      </span>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 bg-blue-600 text-white rounded-2xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">
                      Jawaban / Penjelasan
                    </span>
                    <div className="text-center my-auto">
                      <p className="text-base md:text-lg font-medium leading-relaxed text-blue-50">
                        {flashcardsData[currentCardIndex].back}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-blue-200">
                        Klik untuk kembali ke pertanyaan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevCard}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-all shadow-sm"
                >
                  <ArrowLeft size={14} /> Sebelumnya
                </button>
                <button
                  onClick={nextCard}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
                >
                  Selanjutnya <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto py-8">
              {!quizCompleted ? (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
                  {/* Quiz Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Interactive Quiz</span>
                      <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100">Evaluasi Pemahaman Sesi 01</h2>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      Soal {currentQuestion + 1} / {quizData.length}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-zinc-100 mb-6 leading-relaxed">
                    {quizData[currentQuestion].question}
                  </p>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {quizData[currentQuestion].options.map((option, idx) => {
                      let btnStyle = "bg-slate-50 dark:bg-zinc-800/60 border-slate-200/80 dark:border-zinc-700/60 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800";
                      
                      if (selectedAnswer !== null) {
                        if (idx === quizData[currentQuestion].correct) {
                          btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold";
                        } else if (idx === selectedAnswer) {
                          btnStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300";
                        } else {
                          btnStyle = "opacity-50 bg-slate-50 dark:bg-zinc-800/30 border-slate-200 dark:border-zinc-800";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(idx)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && idx === quizData[currentQuestion].correct && (
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          )}
                          {selectedAnswer !== null && idx === selectedAnswer && idx !== quizData[currentQuestion].correct && (
                            <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Callout */}
                  {showExplanation && (
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 mb-6">
                      <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Penjelasan:</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-200 leading-relaxed">
                        {quizData[currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  {/* Next Question Button */}
                  {selectedAnswer !== null && (
                    <button
                      onClick={nextQuestion}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {currentQuestion < quizData.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Kuis'}
                      <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              ) : (
                /* Result Screen */
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 text-center shadow-sm">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-1">Kuis Selesai!</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
                    Berikut adalah hasil penilaian pemahamanmu:
                  </p>

                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/60 inline-block mb-6 min-w-[200px]">
                    <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                      {score} / {quizData.length}
                    </span>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 mt-1">
                      Skor Akhir: {Math.round((score / quizData.length) * 100)}%
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={resetQuiz}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md"
                    >
                      <RotateCcw size={14} /> Ulangi Kuis
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Sidebar: Quick Reference / Concept Highlights */}
        <aside className="hidden xl:block w-72 p-6 border-l border-slate-200 dark:border-zinc-800 text-xs">
          <h4 className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[11px] mb-4">
            Ringkasan Konsep
          </h4>
          
          <div className="space-y-4 text-slate-600 dark:text-zinc-400">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
              <span className="font-semibold text-slate-800 dark:text-zinc-200 block mb-1">4 Kriteria Data Comms</span>
              <p className="text-[11px]">Delivery, Accuracy, Timeliness, Jitter.</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
              <span className="font-semibold text-slate-800 dark:text-zinc-200 block mb-1">PDU Tiap Layer</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>App: Message</li>
                <li>Transport: Segment</li>
                <li>Network: Packet</li>
                <li>Data Link: Frame</li>
                <li>Physical: Bits</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">
              <span className="font-semibold text-slate-800 dark:text-zinc-200 block mb-1">Rumus Mesh Topology</span>
              <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400">Link = N(N-1) / 2</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
