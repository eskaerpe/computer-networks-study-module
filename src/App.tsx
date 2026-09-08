import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ModuleSesi {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  tag: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const SESI_LIST: ModuleSesi[] = [
  {
    id: 'sesi1',
    title: 'Sesi 01: Pengantar Jaringan & Komunikasi Data',
    subtitle: 'Arsitektur Jaringan, Topologi, Model OSI & TCP/IP, Protokol & Standardisasi',
    file: '/computer-networks-study-module/content/sesi1.md',
    tag: 'Sesi 1'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'reading' | 'flashcards' | 'quiz'>('reading');
  const [currentSesiId, setCurrentSesiId] = useState<string>('sesi1');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const activeSesi = SESI_LIST.find(s => s.id === currentSesiId) || SESI_LIST[0];

  useEffect(() => {
    setLoading(true);
    fetch(activeSesi.file)
      .then(res => res.text())
      .then(text => {
        setMarkdownContent(text);
        
        // Generate TOC from headings
        const headings: TocItem[] = [];
        const lines = text.split('\n');
        lines.forEach((line) => {
          if (line.startsWith('## ')) {
            const headingText = line.replace('## ', '').trim();
            const id = headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ id, text: headingText, level: 2 });
          } else if (line.startsWith('### ')) {
            const headingText = line.replace('### ', '').trim();
            const id = headingText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ id, text: headingText, level: 3 });
          }
        });
        setToc(headings);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load markdown', err);
        setMarkdownContent('# Gagal memuat materi\nSilakan coba lagi nanti.');
        setLoading(false);
      });
  }, [currentSesiId]);

  const flashcardsData = [
    { q: "Apa definisi Jaringan Komputer?", a: "Kumpulan dua atau lebih perangkat komputasi yang saling terhubung melalui media transmisi dan protokol standar untuk berbagi data, sumber daya, dan layanan." },
    { q: "Sebutkan 5 komponen utama sistem komunikasi data!", a: "1. Message (Pesan)\n2. Sender (Pengirim)\n3. Receiver (Penerima)\n4. Transmission Medium (Media Transmisi)\n5. Protocol (Protokol)" },
    { q: "Apa bedanya transmisi Simplex, Half-Duplex, dan Full-Duplex?", a: "Simplex: 1 arah (Radio).\nHalf-Duplex: 2 arah bergantian (Walkie-talkie).\nFull-Duplex: 2 arah simultan/bersamaan (Telepon/Ethernet)." },
    { q: "Mengapa Topologi Star paling dominan digunakan pada LAN modern?", a: "Karena isolasi kerusakan per-kabel mudah (kabel putus tidak mematikan node lain) dan sentralisasi manajemen via Switch." },
    { q: "Sebutkan 7 Layer pada OSI Model secara berurutan dari bawah ke atas!", a: "1. Physical, 2. Data Link, 3. Network, 4. Transport, 5. Session, 6. Presentation, 7. Application." },
    { q: "Sebutkan 4 Layer pada TCP/IP Model!", a: "1. Network Access / Link, 2. Internet, 3. Transport, 4. Application." },
    { q: "Apa fungsi utama dari Transport Layer (TCP vs UDP)?", a: "Menyediakan komunikasi end-to-end antar proses aplikasi. TCP handal & connection-oriented; UDP cepat, ringan & connectionless." },
    { q: "Apa perbedaan mendasar antara Standar De Jure dan De Facto?", a: "De Jure: Standar resmi berbadan hukum (IEEE, ISO, IETF).\nDe Facto: Standar adopsi massal pasar tanpa sertifikasi awal resmi." }
  ];

  const quizData = [
    {
      question: "Manakah komponen komunikasi data yang berfungsi sebagai aturan baku penentu format dan sinkronisasi data?",
      options: [
        "Transmission Medium",
        "Protocol",
        "Sender Interface",
        "Message Payload"
      ],
      correct: 1,
      explanation: "Protokol adalah seperangkat aturan baku yang mengatur seluruh proses komunikasi data agar kedua belah pihak dapat saling mengerti format data yang dikirimkan."
    },
    {
      question: "Topologi jaringan yang memiliki reliabilitas fault tolerance tertinggi namun memerlukan biaya instalasi kabel paling tinggi adalah...",
      options: [
        "Star Topology",
        "Ring Topology",
        "Mesh Topology (Full Mesh)",
        "Bus Topology"
      ],
      correct: 2,
      explanation: "Full Mesh menghubungkan setiap node ke seluruh node lainnya secara point-to-point (rumus N(N-1)/2 sambungan), memberikan redundansi maksimal namun paling boros kabel."
    },
    {
      question: "Pada model OSI 7-Layer, enkripsi data, kompresi, dan penerjemahan format encoding (ASCII/UTF-8) terjadi pada layer...",
      options: [
        "Transport Layer",
        "Session Layer",
        "Presentation Layer",
        "Application Layer"
      ],
      correct: 2,
      explanation: "Presentation Layer bertanggung jawab atas sintaks dan semantik informasi yang dipertukarkan, termasuk data translation, enkripsi/dekripsi, dan kompresi."
    },
    {
      question: "Apa kelemahan utama dari topologi Bus tradisional?",
      options: [
        "Membutuhkan perangkat Switch yang mahal",
        "Jika kabel backbone utama (bus) putus, seluruh jaringan akan lumpuh",
        "Tidak mendukung transmisi sinyal digital",
        "Memerlukan konfigurasi routing yang rumit di tiap host"
      ],
      correct: 1,
      explanation: "Topologi Bus memiliki Single Point of Failure pada backbone kabel utamanya. Jika kabel bus terputus, refleksi sinyal merusak transmisi seluruh workstation."
    },
    {
      question: "Protokol TCP berada pada layer apa dalam arsitektur TCP/IP 4-Layer?",
      options: [
        "Network Access Layer",
        "Internet Layer",
        "Transport Layer",
        "Application Layer"
      ],
      correct: 2,
      explanation: "TCP (Transmission Control Protocol) dan UDP beroperasi pada Transport Layer untuk menyediakan layanan transfer data host-to-host."
    }
  ];

  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    if (submittedQuiz) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#e2e8f0] flex flex-col font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0d0e11]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-emerald-500/20 shrink-0">
              CN
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">COMP6047 • Computer Networks</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded self-start sm:self-auto">BINUS</span>
            </div>
          </div>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-xs font-mono text-slate-300"
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
          </button>
        </div>

        {/* Action Toggle Switch */}
        <div className="flex items-center justify-center bg-[#15171c] p-1 rounded-lg border border-white/[0.08] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('reading')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'reading'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📖 Reading
          </button>
          <button
            onClick={() => {
              setActiveTab('flashcards');
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'flashcards'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎴 Flashcards
          </button>
          <button
            onClick={() => {
              setActiveTab('quiz');
              setSubmittedQuiz(false);
              setQuizAnswers({});
            }}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🧠 Quiz
          </button>
        </div>
      </header>

      {/* Mobile Drawer Bar */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#12141a] border-b border-white/[0.1] px-4 py-4 space-y-4">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">Pilih Modul Sesi</h3>
            <div className="grid grid-cols-1 gap-2">
              {SESI_LIST.map(sesi => (
                <button
                  key={sesi.id}
                  onClick={() => {
                    setCurrentSesiId(sesi.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between border ${
                    currentSesiId === sesi.id
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
                  }`}
                >
                  <span>{sesi.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05]">{sesi.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'reading' && toc.length > 0 && (
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">Jump to Section</h3>
              <div className="flex flex-wrap gap-1.5">
                {toc.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] bg-white/[0.04] border border-white/[0.08] text-slate-300 px-2 py-1 rounded hover:border-emerald-500/50"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3-Column Mintlify Documentation Body */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
        {/* Left Column: Module Directory Navigation (Desktop) */}
        <aside className="w-64 border-r border-white/[0.08] p-5 shrink-0 hidden lg:flex flex-col gap-6 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
          <div>
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">Daftar Modul</h2>
            <div className="space-y-1">
              {SESI_LIST.map(sesi => (
                <button
                  key={sesi.id}
                  onClick={() => setCurrentSesiId(sesi.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    currentSesiId === sesi.id
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{sesi.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400">{sesi.tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Format Pembelajaran</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Disusun dengan 5-part pedagogy: Landasan Teori, Intuisi Analogi, Topologi & Layering, Strategi Pemecahan Kasus, dan Evaluasi Bank Soal.
            </p>
          </div>
        </aside>

        {/* Center Column: Reading Lane / Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 max-w-4xl mx-auto w-full">
          {activeTab === 'reading' && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-mono">Memuat materi markdown...</span>
                </div>
              ) : (
                <article className="doc-prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h2: ({ node, ...props }) => {
                        const id = String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h2 id={id} {...props} />;
                      },
                      h3: ({ node, ...props }) => {
                        const id = String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h3 id={id} {...props} />;
                      }
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </article>
              )}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="flex flex-col items-center justify-center py-6 sm:py-12">
              <div className="w-full max-w-lg space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Kartu {currentCardIndex + 1} / {flashcardsData.length}</span>
                  <span className="text-emerald-400">{activeSesi.title}</span>
                </div>

                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[240px] bg-[#12141a] border border-white/[0.1] hover:border-emerald-500/40 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 text-center shadow-xl relative"
                >
                  <span className="absolute top-3 right-3 text-[10px] uppercase font-mono text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded">
                    {isFlipped ? 'Jawaban' : 'Pertanyaan'}
                  </span>
                  
                  <p className={`text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line ${isFlipped ? 'text-emerald-300' : 'text-slate-100'}`}>
                    {isFlipped ? flashcardsData[currentCardIndex].a : flashcardsData[currentCardIndex].q}
                  </p>

                  <span className="absolute bottom-3 text-[11px] text-slate-500">
                    Klik untuk membalik kartu
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    disabled={currentCardIndex === 0}
                    onClick={() => {
                      setCurrentCardIndex(prev => prev - 1);
                      setIsFlipped(false);
                    }}
                    className="px-4 py-2 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08]"
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    disabled={currentCardIndex === flashcardsData.length - 1}
                    onClick={() => {
                      setCurrentCardIndex(prev => prev + 1);
                      setIsFlipped(false);
                    }}
                    className="px-4 py-2 rounded-md bg-emerald-600 text-white text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6 max-w-2xl mx-auto py-2 sm:py-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 mb-1">Evaluasi Pemahaman - {activeSesi.title}</h2>
                <p className="text-xs text-slate-400">Jawab seluruh pertanyaan berikut untuk menguji pemahaman konsep.</p>
              </div>

              <div className="space-y-5">
                {quizData.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 sm:p-5 rounded-xl bg-[#12141a] border border-white/[0.08] space-y-4">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-200 flex gap-2">
                      <span className="text-emerald-400 font-mono">{qIdx + 1}.</span> {q.question}
                    </h3>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        let optionStyle = "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.05]";

                        if (submittedQuiz) {
                          if (isCorrect) {
                            optionStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium";
                          } else if (isSelected) {
                            optionStyle = "bg-rose-500/15 border-rose-500/40 text-rose-300";
                          }
                        } else if (isSelected) {
                          optionStyle = "bg-emerald-600/20 border-emerald-500 text-white font-medium";
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {submittedQuiz && isCorrect && <span className="text-xs">✓ Benar</span>}
                            {submittedQuiz && isSelected && !isCorrect && <span className="text-xs">✗ Salah</span>}
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                        <span className="font-semibold text-emerald-400">Penjelasan:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                {submittedQuiz ? (
                  <div className="flex items-center gap-4">
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Skor: <span className="text-emerald-400 font-mono">{calculateQuizScore()} / {quizData.length}</span>
                    </span>
                    <button
                      onClick={() => {
                        setSubmittedQuiz(false);
                        setQuizAnswers({});
                      }}
                      className="px-3.5 py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white"
                    >
                      Ulangi Kuis
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={Object.keys(quizAnswers).length < quizData.length}
                    onClick={() => setSubmittedQuiz(true)}
                    className="ml-auto px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
                  >
                    Kirim Jawaban
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Column: On-Page Table of Contents (Desktop) */}
        {activeTab === 'reading' && (
          <aside className="w-60 border-l border-white/[0.08] p-5 shrink-0 hidden xl:block sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
            <h2 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">On This Page</h2>
            <nav className="space-y-1.5 text-xs">
              {toc.length > 0 ? (
                toc.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    className={`block truncate transition-colors ${
                      item.level === 3 ? 'pl-3 text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-emerald-400 font-medium'
                    }`}
                  >
                    {item.text}
                  </a>
                ))
              ) : (
                <span className="text-slate-600 text-[11px]">Tidak ada section.</span>
              )}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
