import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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

const BASE_URL = '/computer-networks-study-module';

const SESI_LIST: ModuleSesi[] = [
  {
    id: 'sesi1',
    title: 'Sesi 01: Pengantar Jaringan & Komunikasi Data',
    subtitle: 'Karakteristik Komunikasi Data, Topologi, Model OSI & TCP/IP',
    file: `${BASE_URL}/content/sesi1.md`,
    tag: 'Sesi 1'
  }
];

export default function App() {
  const [currentSesiId] = useState<string>('sesi1');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const activeSesi = SESI_LIST.find((s) => s.id === currentSesiId) || SESI_LIST[0];

  useEffect(() => {
    setLoading(true);
    fetch(activeSesi.file)
      .then((res) => res.text())
      .then((text) => {
        setMarkdownContent(text);
        setLoading(false);

        // Generate TOC
        const lines = text.split('\n');
        const items: TocItem[] = [];
        lines.forEach((line) => {
          const match = line.match(/^(#{2,3})\s+(.+)$/);
          if (match) {
            const level = match[1].length;
            const titleText = match[2].trim();
            const id = titleText
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            items.push({ id, text: titleText, level });
          }
        });
        setToc(items);
      })
      .catch((err) => {
        console.error('Failed to load markdown:', err);
        setLoading(false);
      });
  }, [activeSesi]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-slate-200 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#12151a]/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-600/20 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
              BINUS Computer Networks
            </span>
            <h1 className="text-base font-bold text-white hidden sm:block">
              Study Module Engine
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://github.com/eskaerpe/computer-networks-study-module"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <span>GitHub Repository</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 py-6 gap-6">
        {/* Left Sidebar - Course Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#12151a] border-r border-slate-800 p-4 transform transition-transform duration-200 ease-in-out xl:static xl:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center mb-6 xl:hidden">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi Materi</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Daftar Sesi Kuliah
            </h2>
            <nav className="space-y-1">
              {SESI_LIST.map((sesi) => (
                <button
                  key={sesi.id}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                    currentSesiId === sesi.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{sesi.title}</span>
                  <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-white/80">
                    {sesi.tag}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Center Main Content Lane */}
        <main className="flex-1 min-w-0 max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-th:p-2 prose-td:border prose-td:border-slate-800 prose-td:p-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h2: ({ node, children, ...props }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return (
                      <h2 id={id} className="text-xl font-bold text-indigo-300 border-b border-slate-800 pb-2 mt-8 mb-4" {...props}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ node, children, ...props }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-');
                    return (
                      <h3 id={id} className="text-lg font-semibold text-slate-100 mt-6 mb-3" {...props}>
                        {children}
                      </h3>
                    );
                  }
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </article>
          )}
        </main>

        {/* Right Sidebar - On-Page TOC */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-20 bg-[#12151a]/50 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Daftar Isi Halaman
            </h3>
            <ul className="space-y-2 text-xs">
              {toc.map((item, idx) => (
                <li
                  key={idx}
                  style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                >
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className="text-left text-slate-400 hover:text-indigo-400 transition truncate w-full"
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
