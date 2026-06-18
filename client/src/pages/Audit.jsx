import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

const PLATFORMS = [
  { id: 'Instagram', label: 'Instagram' },
  { id: 'Twitter/X', label: 'Twitter / X', soon: true },
  { id: 'LinkedIn', label: 'LinkedIn', soon: true },
  { id: 'Website', label: 'Website', soon: true },
];

function ScoreBar({ score }) {
  const pct = (score / 10) * 100;
  const color = score < 5 ? '#ef4444' : score <= 7 ? '#f59e0b' : '#3A5E48';
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-black/8">
      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function StatusIcon({ status }) {
  if (status === 'critical') return <span className="text-red-500">&#10005;</span>;
  if (status === 'warning') return <span className="text-amber-500">!</span>;
  return <span className="text-[#3A5E48]">&#10003;</span>;
}

function ScoreCircle({ overall }) {
  const color = overall < 50 ? '#ef4444' : overall < 70 ? '#f59e0b' : '#3A5E48';
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (overall / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="6" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-[#1A1A18]">{overall}</span>
        <span className="text-[10px] text-black/30">/ 100</span>
      </div>
    </div>
  );
}

function LiveLog({ logs, dataPoints, phase }) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col rounded-2xl border border-black/8 bg-[#1A1A18] overflow-hidden h-full">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5 shrink-0">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-[11px] text-white/30 font-mono ml-2">noxtm-scanner</span>
        {phase === 'scraping' && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-green-400" />}
        {phase === 'analyzing' && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-amber-400" />}
        {phase === 'done' && <span className="ml-auto h-2 w-2 rounded-full bg-green-400" />}
      </div>

      {dataPoints.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 px-4 py-2.5 shrink-0">
          {dataPoints.map((d, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] font-mono text-white/60">
              <span className="text-[#8FB89A]">{d.type}</span>
              <span className="text-white/30">:</span>
              <span className="text-white/80">{typeof d.value === 'object' ? JSON.stringify(d.value) : String(d.value)}</span>
            </span>
          ))}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
        {logs.length === 0 && !phase && (
          <div className="flex h-full items-center justify-center text-white/20">
            <span>Waiting for scan...</span>
          </div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="shrink-0 text-white/20">{new Date(log.time).toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className={`${
              log.message.includes('error') || log.message.includes('failed') ? 'text-red-400' :
              log.message.includes('success') || log.message.includes('complete') || log.message.includes('extracted') ? 'text-[#8FB89A]' :
              'text-white/60'
            }`}>
              {log.message}
            </span>
          </div>
        ))}
        {phase && phase !== 'done' && (
          <div className="flex gap-2 py-0.5">
            <span className="text-white/20 animate-pulse">...</span>
            <span className="text-white/30 animate-pulse">
              {phase === 'scraping' ? 'scanning profile' : 'AI analyzing data'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function fmtDisplay(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

export default function Audit() {
  const [platform, setPlatform] = useState('Instagram');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [phase, setPhase] = useState(null);
  const [report, setReport] = useState(null);
  const [scrapedData, setScrapedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [blurred, setBlurred] = useState(false);
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [expertForm, setExpertForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [expertSent, setExpertSent] = useState(false);

  useEffect(() => {
    if (!report) return;
    const t = setTimeout(() => setBlurred(true), 10000);
    return () => clearTimeout(t);
  }, [report]);

  function startAudit(e) {
    e.preventDefault();
    if (!handle.trim() || scanning) return;

    setScanning(true);
    setLogs([]);
    setDataPoints([]);
    setPhase(null);
    setReport(null);
    setScrapedData(null);
    setErrorMsg('');
    setBlurred(false);
    setShowExpertForm(false);
    setExpertSent(false);

    const params = new URLSearchParams({
      platform,
      handle: handle.trim().replace(/^@/, ''),
      ...(email.trim() && { email: email.trim() }),
      ...(competitors.trim() && { competitors: competitors.trim() }),
    });

    const evtSource = new EventSource(`/api/audit/stream?${params}`);

    evtSource.addEventListener('log', (e) => {
      setLogs(prev => [...prev, JSON.parse(e.data)]);
    });
    evtSource.addEventListener('data', (e) => {
      setDataPoints(prev => [...prev, JSON.parse(e.data)]);
    });
    evtSource.addEventListener('phase', (e) => {
      setPhase(JSON.parse(e.data).phase);
    });
    evtSource.addEventListener('scraped', (e) => {
      const parsed = JSON.parse(e.data);
      if (parsed.data) setScrapedData(parsed.data);
    });
    evtSource.addEventListener('report', (e) => {
      setReport(JSON.parse(e.data));
      setScanning(false);
      evtSource.close();
    });
    evtSource.addEventListener('error', (e) => {
      try { setErrorMsg(JSON.parse(e.data).message); }
      catch { setErrorMsg('Connection lost. Try again.'); }
      setScanning(false);
      evtSource.close();
    });
    evtSource.onerror = () => {
      if (scanning) { setErrorMsg('Connection lost. Try again.'); setScanning(false); }
      evtSource.close();
    };
  }

  function reset() {
    setHandle(''); setEmail(''); setCompetitors('');
    setScanning(false); setLogs([]); setDataPoints([]);
    setPhase(null); setReport(null); setScrapedData(null);
    setErrorMsg(''); setBlurred(false);
    setShowExpertForm(false); setExpertSent(false);
  }

  async function submitExpertForm(e) {
    e.preventDefault();
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: expertForm.name,
          email: expertForm.email,
          message: `[Audit follow-up] ${platform} @${handle} (Score: ${report?.overall}/100). Phone: ${expertForm.phone || 'N/A'}. ${expertForm.message}`,
          source: 'audit-expert',
        }),
      });
      setExpertSent(true);
    } catch {
      setExpertSent(true);
    }
  }

  function downloadReport() {
    if (!report) return;
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();   // 210
    const ph = doc.internal.pageSize.getHeight();  // 297
    const M = 16;                                  // page margin
    const CW = pw - M * 2;                         // content width

    // Brand palette
    const INK = [26, 26, 24];
    const GREEN = [58, 94, 72];
    const GREEN_LT = [143, 184, 154];
    const GOLD = [217, 164, 65];
    const PAPER = [245, 242, 237];
    const RED = [239, 68, 68];
    const AMBER = [245, 158, 11];
    const GREY = [120, 120, 115];

    let y = 0;

    const scoreColor = (s10) => (s10 < 5 ? RED : s10 <= 7 ? AMBER : GREEN);
    const overallColor = report.overall < 50 ? RED : report.overall < 70 ? AMBER : GREEN;

    function checkPage(need = 14) {
      if (y + need > ph - 22) { doc.addPage(); y = 22; }
    }

    function sectionTitle(title) {
      checkPage(18);
      doc.setFillColor(...GREEN);
      doc.rect(M, y - 3.2, 1.6, 4.5, 'F');
      doc.setTextColor(...INK);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), M + 5, y);
      doc.setLineWidth(0.15);
      doc.setDrawColor(210, 205, 195);
      doc.line(M, y + 3, pw - M, y + 3);
      y += 10;
    }

    function arc(cx, cy, r, startDeg, endDeg, color, width) {
      doc.setDrawColor(...color);
      doc.setLineWidth(width);
      doc.setLineCap('round');
      const steps = Math.max(8, Math.floor(Math.abs(endDeg - startDeg) / 4));
      let prev = null;
      for (let i = 0; i <= steps; i++) {
        const a = ((startDeg + ((endDeg - startDeg) * i) / steps) - 90) * (Math.PI / 180);
        const pt = [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        if (prev) doc.line(prev[0], prev[1], pt[0], pt[1]);
        prev = pt;
      }
    }

    function scoreBar(x, yy, w, score10) {
      doc.setFillColor(232, 228, 220);
      doc.roundedRect(x, yy, w, 2.2, 1.1, 1.1, 'F');
      const fillW = Math.max(2.2, (score10 / 10) * w);
      doc.setFillColor(...scoreColor(score10));
      doc.roundedRect(x, yy, fillW, 2.2, 1.1, 1.1, 'F');
    }

    /* ───────── COVER HEADER ───────── */
    doc.setFillColor(...INK);
    doc.rect(0, 0, pw, 78, 'F');
    // brand
    doc.setTextColor(...GOLD);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('N O X T M   S T U D I O', M, 16);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    doc.setDrawColor(80, 80, 76);
    doc.line(M, 20, M + 60, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Social Media', M, 34);
    doc.text('Audit Report', M, 44);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GREEN_LT);
    doc.text(`@${handle}`, M, 56);
    doc.setTextColor(160, 158, 152);
    doc.text(`${platform}  ·  ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, M, 62);
    if (report.dataNote) {
      doc.setFontSize(8);
      doc.setTextColor(...GOLD);
      doc.text(report.dataNote.toUpperCase(), M, 70);
    }

    // Score ring (right side of header)
    const cx = pw - 42, cy = 39, r = 19;
    arc(cx, cy, r, 0, 360, [60, 60, 56], 3);
    arc(cx, cy, r, 0, (report.overall / 100) * 360, overallColor, 3);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(String(report.overall), cx, cy + 2.5, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 148, 142);
    doc.text('OVERALL / 100', cx, cy + 9, { align: 'center' });

    y = 90;

    /* ───────── SUMMARY ───────── */
    doc.setFillColor(...PAPER);
    const summaryLines = doc.splitTextToSize(report.summary || '', CW - 16);
    const sumH = summaryLines.length * 5 + 14;
    doc.roundedRect(M, y - 6, CW, sumH, 3, 3, 'F');
    doc.setFillColor(...GREEN);
    doc.rect(M, y - 6, 1.8, sumH, 'F');
    doc.setTextColor(...GREEN);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('KEY FINDING', M + 7, y);
    doc.setTextColor(60, 58, 54);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(summaryLines, M + 7, y + 6);
    y += sumH + 6;

    /* ───────── PROFILE SNAPSHOT ───────── */
    if (scrapedData && (scrapedData.followers || scrapedData.bio)) {
      const stats = [
        ['Followers', fmtDisplay(scrapedData.followers)],
        ['Following', fmtDisplay(scrapedData.following)],
        ['Posts', String(scrapedData.postCount || 0)],
        ['Eng. Rate', scrapedData.engagement?.engagementRate ? `${scrapedData.engagement.engagementRate}%` : '—'],
        ['Posts/Week', scrapedData.engagement?.postsPerWeek ? String(scrapedData.engagement.postsPerWeek) : '—'],
      ];
      const bw = CW / stats.length;
      checkPage(26);
      stats.forEach((s, i) => {
        const x = M + i * bw;
        doc.setDrawColor(215, 210, 200);
        doc.setLineWidth(0.2);
        doc.roundedRect(x + 1, y, bw - 2, 16, 2, 2, 'S');
        doc.setTextColor(...INK);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(String(s[1]), x + bw / 2, y + 7, { align: 'center' });
        doc.setTextColor(...GREY);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'normal');
        doc.text(s[0].toUpperCase(), x + bw / 2, y + 12.5, { align: 'center' });
      });
      y += 24;
    }

    /* ───────── QUICK WINS ───────── */
    if (report.quickWins?.length) {
      sectionTitle('Quick Wins — Do These Today');
      for (let i = 0; i < report.quickWins.length; i++) {
        checkPage(9);
        doc.setFillColor(...GREEN);
        doc.circle(M + 3, y - 1, 2.6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(String(i + 1), M + 3, y + 0.2, { align: 'center' });
        doc.setTextColor(60, 58, 54);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(report.quickWins[i], CW - 14);
        doc.text(lines, M + 9, y);
        y += lines.length * 4.6 + 3.5;
      }
      y += 4;
    }

    /* ───────── CATEGORY SCORES ───────── */
    sectionTitle('Category Scores');
    const colW = (CW - 6) / 2;
    let col = 0, rowStartY = y;
    for (const cat of report.categories) {
      const x = M + col * (colW + 6);
      if (col === 0) { checkPage(26); rowStartY = y; }
      const yy = rowStartY;

      doc.setDrawColor(215, 210, 200);
      doc.setLineWidth(0.2);
      doc.roundedRect(x, yy, colW, 23, 2, 2, 'S');

      doc.setTextColor(...INK);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(cat.name, x + 4, yy + 6);
      doc.setTextColor(...scoreColor(cat.score));
      doc.text(`${cat.score}/10`, x + colW - 4, yy + 6, { align: 'right' });

      scoreBar(x + 4, yy + 8.5, colW - 8, cat.score);

      doc.setTextColor(...GREY);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(cat.problem || '', colW - 8)[0] || '', x + 4, yy + 15);
      doc.setTextColor(...GREEN);
      doc.setFont('helvetica', 'bold');
      doc.text(doc.splitTextToSize(`Fix: ${cat.fix || ''}`, colW - 8)[0] || '', x + 4, yy + 19.5);

      if (col === 1) y = rowStartY + 27;
      col = (col + 1) % 2;
    }
    if (col === 1) y = rowStartY + 27;
    y += 2;

    /* ───────── BENCHMARKS ───────── */
    if (report.benchmarks) {
      sectionTitle('You vs Industry');
      const rows = [];
      const b = report.benchmarks;
      if (b.engagementRate) rows.push(['Engagement Rate', b.engagementRate.yours, b.engagementRate.industry, b.engagementRate.verdict]);
      if (b.postingFrequency) rows.push(['Posting Frequency', b.postingFrequency.yours, b.postingFrequency.ideal, b.postingFrequency.verdict]);
      if (b.followerRatio) rows.push(['Follower Ratio', b.followerRatio.value, '—', b.followerRatio.verdict]);

      // table head
      checkPage(10 + rows.length * 9);
      doc.setFillColor(...INK);
      doc.roundedRect(M, y, CW, 7, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('METRIC', M + 4, y + 4.7);
      doc.text('YOURS', M + CW * 0.42, y + 4.7);
      doc.text('BENCHMARK', M + CW * 0.6, y + 4.7);
      doc.text('VERDICT', M + CW * 0.82, y + 4.7);
      y += 9;

      rows.forEach((r2, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(...PAPER);
          doc.rect(M, y - 1.5, CW, 8, 'F');
        }
        doc.setTextColor(...INK);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(r2[0], M + 4, y + 3.2);
        doc.setFont('helvetica', 'normal');
        doc.text(String(r2[1]), M + CW * 0.42, y + 3.2);
        doc.setTextColor(...GREY);
        doc.text(String(r2[2]), M + CW * 0.6, y + 3.2);
        const v = String(r2[3] || '');
        const vc = v === 'above' ? GREEN : v === 'below' ? RED : AMBER;
        doc.setTextColor(...vc);
        doc.setFont('helvetica', 'bold');
        doc.text(v.toUpperCase().slice(0, 22), M + CW * 0.82, y + 3.2);
        y += 8.5;
      });
      y += 4;
    }

    /* ───────── SUGGESTED BIO ───────── */
    if (report.bioRewrite && report.bioRewrite !== 'N/A') {
      sectionTitle('Suggested Bio (Copy-Paste Ready)');
      const bioLines = doc.splitTextToSize(`"${report.bioRewrite}"`, CW - 12);
      const bh = bioLines.length * 5 + 8;
      checkPage(bh + 4);
      doc.setDrawColor(...GREEN);
      doc.setLineWidth(0.4);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.roundedRect(M, y - 2, CW, bh, 2, 2, 'S');
      doc.setLineDashPattern([], 0);
      doc.setTextColor(...GREEN);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'italic');
      doc.text(bioLines, M + 6, y + 4);
      y += bh + 6;
    }

    /* ───────── GROWTH FORECAST ───────── */
    if (report.growthForecast) {
      sectionTitle('Growth Forecast');
      const g = report.growthForecast;
      const cards = [
        ['30 DAYS, NO CHANGE', g.current30, GREY],
        ['30 DAYS, OPTIMIZED', g.optimized30, GREEN],
        ['90 DAYS, OPTIMIZED', g.optimized90, GOLD],
      ];
      checkPage(28);
      const gw = (CW - 8) / 3;
      cards.forEach((c, i) => {
        const x = M + i * (gw + 4);
        doc.setFillColor(...INK);
        doc.roundedRect(x, y, gw, 20, 2.5, 2.5, 'F');
        doc.setTextColor(c[2][0], c[2][1], c[2][2]);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.text(c[0], x + gw / 2, y + 6, { align: 'center' });
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text(String(c[1] || '—'), x + gw / 2, y + 14, { align: 'center' });
      });
      y += 24;
      if (g.note) {
        doc.setTextColor(...GREY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text(doc.splitTextToSize(g.note, CW), M, y);
        y += 8;
      }
    }

    /* ───────── CONTENT STRATEGY ───────── */
    if (report.contentStrategy?.pillars?.length) {
      sectionTitle('Content Strategy');
      if (report.contentStrategy.bestFormat) {
        doc.setTextColor(...GREEN);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(`BEST FORMAT: ${report.contentStrategy.bestFormat.toUpperCase()}`, M, y);
        if (report.contentStrategy.formatNote) {
          doc.setTextColor(...GREY);
          doc.setFont('helvetica', 'normal');
          doc.text(`— ${report.contentStrategy.formatNote}`, M + doc.getTextWidth(`BEST FORMAT: ${report.contentStrategy.bestFormat.toUpperCase()}`) + 3, y);
        }
        y += 7;
      }
      for (const p of report.contentStrategy.pillars) {
        checkPage(13);
        doc.setTextColor(...INK);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(p.name, M, y);
        doc.setTextColor(...GREEN);
        doc.text(`${p.pct}%`, M + CW, y, { align: 'right' });
        scoreBar(M, y + 2, CW, Math.min(p.pct, 100) / 10);
        doc.setTextColor(...GREY);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(p.why || '', M, y + 8);
        y += 13;
      }
      y += 2;
    }

    /* ───────── 30-DAY ACTION PLAN ───────── */
    if (report.actionPlan?.length) {
      sectionTitle('Your 30-Day Action Plan');
      for (const w of report.actionPlan) {
        const actions = w.actions || [];
        const blockH = 10 + actions.length * 5;
        checkPage(blockH + 2);
        doc.setFillColor(...GREEN);
        doc.roundedRect(M, y - 2, 14, 7, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`W${w.week}`, M + 7, y + 2.6, { align: 'center' });
        doc.setTextColor(...INK);
        doc.setFontSize(10);
        doc.text(w.focus || '', M + 18, y + 2.6);
        y += 9;
        for (const a of actions) {
          doc.setFillColor(...GREEN);
          doc.circle(M + 4, y - 1, 0.8, 'F');
          doc.setTextColor(70, 68, 64);
          doc.setFontSize(8.5);
          doc.setFont('helvetica', 'normal');
          doc.text(doc.splitTextToSize(a, CW - 12)[0] || '', M + 8, y);
          y += 5;
        }
        y += 3;
      }
    }

    /* ───────── POST ANALYSIS ───────── */
    if (report.postAnalysis?.length) {
      sectionTitle('Post-by-Post Breakdown');
      for (const p of report.postAnalysis) {
        checkPage(15);
        const vc = p.verdict === 'good' ? GREEN : p.verdict === 'poor' ? RED : AMBER;
        doc.setFillColor(...PAPER);
        doc.roundedRect(M, y - 3, CW, 12.5, 2, 2, 'F');
        doc.setFillColor(...vc);
        doc.rect(M, y - 3, 1.5, 12.5, 'F');

        doc.setTextColor(...INK);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(`#${p.index}  ${(p.type || '').toUpperCase()}${p.date && p.date !== 'N/A' ? `  ·  ${p.date}` : ''}`, M + 5, y + 1);
        doc.setTextColor(...vc);
        doc.text((p.verdict || '').toUpperCase(), M + CW - 4, y + 1, { align: 'right' });

        const metrics = [];
        if (p.views) metrics.push(`${fmtDisplay(p.views)} views`);
        if (p.likes) metrics.push(`${fmtDisplay(p.likes)} likes`);
        if (p.comments) metrics.push(`${fmtDisplay(p.comments)} comments`);
        doc.setTextColor(...GREY);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`${metrics.join('  ·  ')}${p.note ? `   —  ${p.note}` : ''}`.slice(0, 110), M + 5, y + 6);
        y += 14;
      }
      y += 2;
    }

    /* ───────── TRENDS ───────── */
    if (report.trends) {
      sectionTitle('Trends & Insights');
      const t = report.trends;
      const items = [
        ['Best Time to Post', t.bestPostTime],
        ['Content That Works', t.contentTrend],
        ['Niche Direction', t.nicheTrend],
        ['Hashtag Strategy', t.hashtagVerdict],
      ].filter(i => i[1]);
      for (const [label, val] of items) {
        checkPage(10);
        doc.setTextColor(...GREEN);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(label.toUpperCase(), M, y);
        doc.setTextColor(...INK);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        const vl = doc.splitTextToSize(String(val), CW);
        doc.text(vl, M, y + 4.5);
        y += 4.5 + vl.length * 4.6 + 3;
      }
      if (t.topHashtags?.length) {
        checkPage(8);
        doc.setTextColor(...GREEN);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.text(t.topHashtags.map(h => `#${h}`).join('   '), M, y);
        y += 8;
      }
    }

    /* ───────── COMPETITORS ───────── */
    if (report.competitors?.length) {
      sectionTitle('Competitor Analysis');
      for (const c of report.competitors) {
        checkPage(18);
        doc.setTextColor(...INK);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.text(`@${c.handle}`, M, y);
        doc.setTextColor(...GREY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${typeof c.followers === 'number' ? fmtDisplay(c.followers) : c.followers} followers${c.engRate ? `  ·  ${c.engRate} engagement` : ''}`, M + CW, y, { align: 'right' });
        y += 5;
        if (c.strength) {
          doc.setTextColor(...RED);
          doc.setFontSize(8);
          doc.text(`They beat you: ${c.strength}`, M + 4, y);
          y += 4.5;
        }
        if (c.weakness) {
          doc.setTextColor(...GREEN);
          doc.text(`You beat them: ${c.weakness}`, M + 4, y);
          y += 4.5;
        }
        y += 3;
      }
    }

    /* ───────── CTA BLOCK ───────── */
    checkPage(34);
    y += 2;
    doc.setFillColor(...INK);
    doc.roundedRect(M, y, CW, 26, 3, 3, 'F');
    doc.setTextColor(...GOLD);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('LIMITED SLOTS PER QUARTER', M + 8, y + 8);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('Want us to fix all of this for you?', M + 8, y + 15);
    doc.setTextColor(...GREEN_LT);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Book a free consultation at noxtmstudio.com/contact', M + 8, y + 21);

    /* ───────── FOOTERS ───────── */
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setDrawColor(215, 210, 200);
      doc.setLineWidth(0.2);
      doc.line(M, ph - 14, pw - M, ph - 14);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 148, 142);
      doc.text(`NOXTM Studio  ·  Social Media Audit  ·  @${handle}`, M, ph - 9);
      doc.text(`Page ${i} of ${pages}`, pw - M, ph - 9, { align: 'right' });
    }

    doc.save(`noxtm-audit-${handle || 'report'}.pdf`);
  }

  const profilePicSrc = scrapedData?.profilePicBase64 || scrapedData?.profilePic;

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A18]">
      <section className="container-x py-10">
        <div className="relative">

          <div className={`grid gap-6 lg:grid-cols-2 transition-all duration-500 ${blurred ? 'blur-[3px] pointer-events-none select-none' : ''}`}>

            {/* LEFT SIDE */}
            <div className="flex flex-col">

              {/* Form */}
              {!report && !errorMsg && (
                <div>
                  <span className="mb-3 inline-block rounded-full border border-black/8 bg-black/[0.04] px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-black/40">
                    Free Social Media Audit
                  </span>
                  <h1 className="text-3xl font-bold leading-tight md:text-4xl" style={{ fontFamily: "'Gambetta', serif" }}>
                    Find out why your brand<br />
                    <span className="text-[#3A5E48]">isn't going viral</span>
                  </h1>
                  <p className="mt-3 max-w-sm text-sm text-black/45">
                    Enter your handle. Watch our scanner crawl your profile in real time.
                  </p>

                  <form onSubmit={startAudit} className="mt-6 rounded-2xl border border-black/6 bg-white p-6 shadow-sm">
                    <div className="mb-5">
                      <label className="mb-2 block text-xs font-medium text-black/40">Platform</label>
                      <div className="flex flex-wrap gap-1.5">
                        {PLATFORMS.map(p => (
                          <button key={p.id} type="button"
                            onClick={() => !p.soon && !scanning && setPlatform(p.id)}
                            disabled={scanning || p.soon}
                            className={`relative rounded-full border px-3 py-1 text-xs font-medium transition ${
                              p.soon
                                ? 'border-black/6 text-black/20 cursor-not-allowed'
                                : platform === p.id
                                  ? 'border-[#3A5E48] bg-[#3A5E48]/8 text-[#3A5E48]'
                                  : 'border-black/10 text-black/35 hover:border-black/20'
                            }`}>
                            {p.label}
                            {p.soon && (
                              <span className="ml-1.5 rounded-full bg-black/6 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-black/30">
                                Soon
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-1.5 block text-xs font-medium text-black/40">
                        {platform === 'Website' ? 'Website URL' : 'Username'}
                      </label>
                      <div className="flex items-center rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 focus-within:border-black/25">
                        {platform !== 'Website' && <span className="mr-1 text-xs text-black/20">@</span>}
                        <input type="text" value={handle} onChange={e => setHandle(e.target.value)}
                          placeholder={platform === 'Website' ? 'yourbrand.com' : 'yourbrand'} required disabled={scanning}
                          className="flex-1 bg-transparent text-sm text-[#1A1A18] placeholder:text-black/20 outline-none disabled:opacity-50" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-1.5 block text-xs font-medium text-black/40">
                        Email <span className="text-black/20 font-normal">(optional)</span>
                      </label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" disabled={scanning}
                        className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25 disabled:opacity-50" />
                    </div>

                    {platform === 'Instagram' && (
                      <div className="mb-5">
                        <label className="mb-1.5 block text-xs font-medium text-black/40">
                          Competitors <span className="text-black/20 font-normal">(optional, comma-separated)</span>
                        </label>
                        <input type="text" value={competitors} onChange={e => setCompetitors(e.target.value)}
                          placeholder="@competitor1, @competitor2" disabled={scanning}
                          className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] placeholder:text-black/20 outline-none focus:border-black/25 disabled:opacity-50" />
                      </div>
                    )}

                    <button type="submit" disabled={scanning}
                      className="w-full rounded-full bg-[#1A1A18] py-2.5 text-sm font-semibold text-white transition hover:bg-[#2d2d2a] disabled:opacity-50">
                      {scanning ? 'Scanning...' : 'Analyze My Profile \u2192'}
                    </button>
                  </form>
                </div>
              )}

              {/* Results left: score + profile + categories + competitors */}
              {report && (
                <div className="space-y-3">
                  {/* Score header */}
                  <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                      <ScoreCircle overall={report.overall} />
                      <div className="flex-1 min-w-0">
                        {report.dataNote && (
                          <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                            report.dataNote.toLowerCase().includes('real') ? 'bg-[#3A5E48]/10 text-[#3A5E48]' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {report.dataNote}
                          </span>
                        )}
                        <h2 className="text-lg font-bold" style={{ fontFamily: "'Gambetta', serif" }}>
                          {report.overall < 50 ? 'Needs serious work' : report.overall < 70 ? 'Room to grow' : 'Solid foundation'}
                        </h2>
                        <p className="mt-0.5 text-xs text-black/50 line-clamp-2">{report.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Private profile notice */}
                  {scrapedData?.isPrivate && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                      <p className="text-sm font-semibold text-amber-700">Profile is Private</p>
                      <p className="mt-1 text-xs text-amber-600/70">Make it a public profile so we can scan your posts and give you a detailed audit.</p>
                    </div>
                  )}

                  {/* Scraped profile snapshot */}
                  {scrapedData && (scrapedData.followers > 0 || scrapedData.bio) && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        {profilePicSrc && (
                          <img src={profilePicSrc} referrerPolicy="no-referrer"
                            onError={e => { e.target.style.display = 'none'; }}
                            className="h-12 w-12 rounded-full object-cover" alt="" />
                        )}
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold truncate">@{scrapedData.handle || handle}</h3>
                          {scrapedData.name && <p className="text-xs text-black/40">{scrapedData.name}</p>}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-black/50">
                        {scrapedData.followers > 0 && <span><strong className="text-black/70">{fmtDisplay(scrapedData.followers)}</strong> followers</span>}
                        {scrapedData.following > 0 && <span><strong className="text-black/70">{fmtDisplay(scrapedData.following)}</strong> following</span>}
                        {scrapedData.postCount > 0 && <span><strong className="text-black/70">{scrapedData.postCount}</strong> posts</span>}
                        {scrapedData.engagement?.engagementRate && (
                          <span><strong className="text-black/70">{scrapedData.engagement.engagementRate}%</strong> eng. rate</span>
                        )}
                        {scrapedData.engagement?.postsPerWeek && (
                          <span><strong className="text-black/70">{scrapedData.engagement.postsPerWeek}</strong> posts/week</span>
                        )}
                      </div>
                      {scrapedData.bio && <p className="mt-2 text-[11px] text-black/35 italic truncate">"{scrapedData.bio}"</p>}
                    </div>
                  )}

                  {/* Category cards */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {report.categories.map(cat => (
                      <div key={cat.name} className="rounded-xl border border-black/6 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#1A1A18]">{cat.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0 text-xs">
                            <span className="text-black/25">{cat.score}/10</span>
                            <StatusIcon status={cat.status} />
                          </div>
                        </div>
                        <ScoreBar score={cat.score} />
                        <p className="mt-2 text-[11px] leading-relaxed text-black/45">{cat.problem}</p>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-[#3A5E48] font-medium">{cat.fix}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Wins */}
                  {report.quickWins?.length > 0 && (
                    <div className="rounded-2xl border border-[#3A5E48]/20 bg-[#3A5E48]/5 p-5">
                      <h3 className="mb-3 text-sm font-bold text-[#3A5E48]">Quick Wins — Do These Today</h3>
                      <ul className="space-y-2">
                        {report.quickWins.map((w, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-black/60">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3A5E48] text-[9px] font-bold text-white">{i + 1}</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Benchmarks */}
                  {report.benchmarks && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-bold text-[#1A1A18]">You vs Industry</h3>
                      <div className="space-y-2.5">
                        {report.benchmarks.engagementRate && (
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F2ED]/70 px-3 py-2.5">
                            <span className="text-[11px] font-medium text-black/50">Engagement Rate</span>
                            <div className="flex items-center gap-2 text-[11px]">
                              <strong className="text-black/70">{report.benchmarks.engagementRate.yours}</strong>
                              <span className="text-black/25">vs {report.benchmarks.engagementRate.industry}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                                report.benchmarks.engagementRate.verdict === 'above' ? 'bg-[#3A5E48]/10 text-[#3A5E48]' :
                                report.benchmarks.engagementRate.verdict === 'below' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                              }`}>{report.benchmarks.engagementRate.verdict}</span>
                            </div>
                          </div>
                        )}
                        {report.benchmarks.postingFrequency && (
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F2ED]/70 px-3 py-2.5">
                            <span className="text-[11px] font-medium text-black/50">Posting Frequency</span>
                            <div className="flex items-center gap-2 text-[11px]">
                              <strong className="text-black/70">{report.benchmarks.postingFrequency.yours}</strong>
                              <span className="text-black/25">ideal {report.benchmarks.postingFrequency.ideal}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                                report.benchmarks.postingFrequency.verdict === 'above' ? 'bg-[#3A5E48]/10 text-[#3A5E48]' :
                                report.benchmarks.postingFrequency.verdict === 'below' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                              }`}>{report.benchmarks.postingFrequency.verdict}</span>
                            </div>
                          </div>
                        )}
                        {report.benchmarks.followerRatio && (
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F5F2ED]/70 px-3 py-2.5">
                            <span className="text-[11px] font-medium text-black/50">Follower Ratio</span>
                            <div className="flex items-center gap-2 text-[11px]">
                              <strong className="text-black/70">{report.benchmarks.followerRatio.value}</strong>
                              <span className="text-black/40">{report.benchmarks.followerRatio.verdict}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio rewrite */}
                  {report.bioRewrite && report.bioRewrite !== 'N/A' && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-2 text-sm font-bold text-[#1A1A18]">Suggested Bio</h3>
                      <div className="rounded-xl border border-dashed border-[#3A5E48]/30 bg-[#3A5E48]/5 p-3">
                        <p className="text-xs leading-relaxed text-[#3A5E48]">{report.bioRewrite}</p>
                      </div>
                      <p className="mt-2 text-[10px] text-black/30">Copy-paste ready. Optimized for search and conversion.</p>
                    </div>
                  )}

                  {/* Competitor Analysis */}
                  {report.competitors?.length > 0 && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-bold text-[#1A1A18]">Competitor Analysis</h3>
                      <div className="space-y-2">
                        {report.competitors.map((comp, i) => (
                          <div key={i} className="rounded-xl border border-black/5 bg-[#F5F2ED]/50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-[#1A1A18]">@{comp.handle}</span>
                              <span className="text-[11px] text-black/40">{typeof comp.followers === 'number' ? fmtDisplay(comp.followers) : comp.followers} followers</span>
                            </div>
                            {comp.engRate && <p className="mt-1 text-[10px] text-black/30">Engagement: {comp.engRate}</p>}
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              {comp.strength && (
                                <div className="rounded-lg bg-red-50 px-2 py-1.5">
                                  <span className="text-[9px] font-medium uppercase text-red-400">They beat you</span>
                                  <p className="text-[11px] text-red-600">{comp.strength}</p>
                                </div>
                              )}
                              {comp.weakness && (
                                <div className="rounded-lg bg-[#3A5E48]/8 px-2 py-1.5">
                                  <span className="text-[9px] font-medium uppercase text-[#3A5E48]">You beat them</span>
                                  <p className="text-[11px] text-[#3A5E48]">{comp.weakness}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {errorMsg && !report && (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <p className="mb-4 text-sm text-red-500">{errorMsg}</p>
                  <button onClick={reset}
                    className="rounded-full border border-black/15 px-6 py-2 text-sm text-black/60 transition hover:text-black/80">
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div style={{ minHeight: 400 }}>
              {!report && (
                <LiveLog logs={logs} dataPoints={dataPoints} phase={phase} />
              )}

              {report && (
                <div className="space-y-3">
                  {report.postAnalysis?.length > 0 && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-bold text-[#1A1A18]">Post-by-Post Breakdown</h3>
                      <div className="space-y-2">
                        {report.postAnalysis.map((post, i) => {
                          const verdictColor = post.verdict === 'good' ? 'text-[#3A5E48] bg-[#3A5E48]/8' : post.verdict === 'poor' ? 'text-red-500 bg-red-50' : 'text-amber-600 bg-amber-50';
                          return (
                            <div key={i} className="rounded-xl border border-black/5 bg-[#F5F2ED]/50 p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-black/40">
                                    #{post.index || i + 1}
                                  </span>
                                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/50 uppercase">
                                    {post.type}
                                  </span>
                                  {post.date && post.date !== 'N/A' && (
                                    <span className="text-[10px] text-black/30">{post.date}</span>
                                  )}
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${verdictColor}`}>
                                  {post.verdict}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-black/50">
                                {post.views > 0 && <span><strong className="text-black/70">{fmtDisplay(post.views)}</strong> views</span>}
                                {post.likes > 0 && <span><strong className="text-black/70">{fmtDisplay(post.likes)}</strong> likes</span>}
                                {post.comments > 0 && <span><strong className="text-black/70">{fmtDisplay(post.comments)}</strong> comments</span>}
                              </div>
                              {post.caption && (
                                <p className="mt-1.5 text-[10px] text-black/30 italic truncate">"{post.caption}"</p>
                              )}
                              <p className="mt-1.5 text-[11px] text-black/55">{post.note}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {report.trends && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-bold text-[#1A1A18]">Trends & Insights</h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {report.trends.bestPostTime && (
                          <div className="rounded-xl bg-[#F5F2ED]/70 p-3">
                            <span className="text-[10px] font-medium uppercase text-black/30">Best Time to Post</span>
                            <p className="mt-0.5 text-xs font-semibold text-[#1A1A18]">{report.trends.bestPostTime}</p>
                          </div>
                        )}
                        {report.trends.contentTrend && (
                          <div className="rounded-xl bg-[#F5F2ED]/70 p-3">
                            <span className="text-[10px] font-medium uppercase text-black/30">Content That Works</span>
                            <p className="mt-0.5 text-xs font-semibold text-[#1A1A18]">{report.trends.contentTrend}</p>
                          </div>
                        )}
                        {report.trends.nicheTrend && (
                          <div className="rounded-xl bg-[#F5F2ED]/70 p-3">
                            <span className="text-[10px] font-medium uppercase text-black/30">Niche Direction</span>
                            <p className="mt-0.5 text-xs font-semibold text-[#1A1A18]">{report.trends.nicheTrend}</p>
                          </div>
                        )}
                        {report.trends.hashtagVerdict && (
                          <div className="rounded-xl bg-[#F5F2ED]/70 p-3">
                            <span className="text-[10px] font-medium uppercase text-black/30">Hashtag Strategy</span>
                            <p className="mt-0.5 text-xs font-semibold text-[#1A1A18]">{report.trends.hashtagVerdict}</p>
                          </div>
                        )}
                      </div>
                      {report.trends.topHashtags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {report.trends.topHashtags.map((tag, i) => (
                            <span key={i} className="rounded-full bg-[#3A5E48]/8 px-2.5 py-0.5 text-[10px] font-medium text-[#3A5E48]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Growth Forecast */}
                  {report.growthForecast && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-bold text-[#1A1A18]">Growth Forecast</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-[#F5F2ED] p-3 text-center">
                          <span className="block text-[9px] uppercase tracking-wider text-black/30">30d, no change</span>
                          <p className="mt-1 text-sm font-bold text-black/50">{report.growthForecast.current30}</p>
                        </div>
                        <div className="rounded-xl bg-[#3A5E48]/10 p-3 text-center ring-1 ring-[#3A5E48]/30">
                          <span className="block text-[9px] uppercase tracking-wider text-[#3A5E48]">30d, optimized</span>
                          <p className="mt-1 text-sm font-bold text-[#3A5E48]">{report.growthForecast.optimized30}</p>
                        </div>
                        <div className="rounded-xl bg-[#D9A441]/10 p-3 text-center ring-1 ring-[#D9A441]/30">
                          <span className="block text-[9px] uppercase tracking-wider text-[#B07D1A]">90d, optimized</span>
                          <p className="mt-1 text-sm font-bold text-[#B07D1A]">{report.growthForecast.optimized90}</p>
                        </div>
                      </div>
                      {report.growthForecast.note && (
                        <p className="mt-3 text-[11px] text-black/40">{report.growthForecast.note}</p>
                      )}
                    </div>
                  )}

                  {/* Content Strategy */}
                  {report.contentStrategy?.pillars?.length > 0 && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1A1A18]">Content Strategy</h3>
                        {report.contentStrategy.bestFormat && (
                          <span className="rounded-full bg-[#3A5E48]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[#3A5E48]">
                            Best: {report.contentStrategy.bestFormat}
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {report.contentStrategy.pillars.map((p, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-black/70">{p.name}</span>
                              <span className="font-bold text-[#3A5E48]">{p.pct}%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-black/6">
                              <div className="h-1.5 rounded-full bg-[#3A5E48] transition-all duration-700" style={{ width: `${Math.min(p.pct, 100)}%` }} />
                            </div>
                            <p className="mt-1 text-[10px] text-black/35">{p.why}</p>
                          </div>
                        ))}
                      </div>
                      {report.contentStrategy.formatNote && (
                        <p className="mt-3 text-[11px] text-black/45">{report.contentStrategy.formatNote}</p>
                      )}
                    </div>
                  )}

                  {/* 30-Day Action Plan */}
                  {report.actionPlan?.length > 0 && (
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
                      <h3 className="mb-3 text-sm font-bold text-[#1A1A18]">Your 30-Day Action Plan</h3>
                      <div className="space-y-2">
                        {report.actionPlan.map((w) => (
                          <div key={w.week} className="rounded-xl border border-black/5 bg-[#F5F2ED]/50 p-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3A5E48] text-[10px] font-bold text-white">
                                W{w.week}
                              </span>
                              <span className="text-xs font-semibold text-[#1A1A18]">{w.focus}</span>
                            </div>
                            <ul className="mt-2 space-y-1 pl-8">
                              {w.actions?.map((a, i) => (
                                <li key={i} className="list-disc text-[11px] text-black/50">{a}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* OVERLAY */}
          {report && blurred && (
            <div className="absolute inset-0 z-30 flex items-start justify-center pt-24">
              <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-2xl border border-black/5">

                {!showExpertForm ? (
                  <>
                    <div className="mx-auto mb-5">
                      <ScoreCircle overall={report.overall} />
                    </div>

                    <h3 className="text-2xl font-bold text-[#1A1A18]" style={{ fontFamily: "'Gambetta', serif" }}>
                      Your audit is ready
                    </h3>

                    <p className="mt-2 text-lg font-semibold text-[#3A5E48]" style={{ fontFamily: "'Gambetta', serif" }}>
                      Coffee or Beer? It's on us!
                    </p>

                    <p className="mt-2 text-sm text-black/40">
                      {report.overall < 50 ? 'Your profile needs work. Let\'s fix it together.' :
                       report.overall < 70 ? 'Room to grow. Small changes, big results.' :
                       'Solid base. Let\'s take it to the next level.'}
                    </p>

                    <div className="mt-8 flex flex-col gap-3">
                      <button onClick={downloadReport}
                        className="group w-full rounded-full bg-[#1A1A18] py-3 text-sm font-semibold text-white transition hover:bg-[#2d2d2a] flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Report (PDF)
                      </button>
                      <button onClick={() => setShowExpertForm(true)}
                        className="w-full rounded-full bg-[#3A5E48] py-3 text-sm font-semibold text-white text-center transition hover:bg-[#4a7a5e] flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Talk to an Expert
                      </button>
                      <button onClick={reset}
                        className="w-full rounded-full border border-black/10 py-3 text-sm font-medium text-black/45 transition hover:text-black/70 hover:border-black/25">
                        Audit Another
                      </button>
                    </div>

                    <p className="mt-6 text-[10px] text-black/25">Powered by NoxtmStudio</p>
                  </>
                ) : (
                  <>
                    {!expertSent ? (
                      <>
                        <form onSubmit={submitExpertForm} className="text-left">
                          {/* Back + heading inside form */}
                          <button type="button" onClick={() => setShowExpertForm(false)}
                            className="flex items-center gap-1 text-xs text-black/35 hover:text-black/60 mb-5 transition">
                            &larr; Back
                          </button>
                          <h3 className="text-xl font-bold text-[#1A1A18]" style={{ fontFamily: "'Gambetta', serif" }}>
                            Talk to an Expert
                          </h3>
                          <p className="mt-1 mb-5 text-xs text-black/40">We'll review your audit and reach out with a plan.</p>

                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-black/40">Name</label>
                              <input type="text" required value={expertForm.name}
                                onChange={e => setExpertForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-black/25" />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-black/40">Email</label>
                              <input type="email" required value={expertForm.email}
                                onChange={e => setExpertForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-black/25" />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-black/40">Phone <span className="text-black/20 font-normal">(optional)</span></label>
                              <input type="tel" value={expertForm.phone}
                                onChange={e => setExpertForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+1 234 567 8900"
                                className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-black/25" />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-black/40">Message <span className="text-black/20 font-normal">(optional)</span></label>
                              <textarea rows={3} value={expertForm.message}
                                onChange={e => setExpertForm(f => ({ ...f, message: e.target.value }))}
                                placeholder="What do you need help with?"
                                className="w-full rounded-xl border border-black/10 bg-[#F5F2ED] px-3 py-2.5 text-sm text-[#1A1A18] outline-none focus:border-black/25 resize-none" />
                            </div>
                            <button type="submit"
                              className="w-full rounded-full bg-[#3A5E48] py-3 text-sm font-semibold text-white transition hover:bg-[#4a7a5e]">
                              Send
                            </button>
                          </div>
                        </form>
                      </>
                    ) : (
                      <div className="py-8">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3A5E48]/10">
                          <svg className="h-7 w-7 text-[#3A5E48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#1A1A18]" style={{ fontFamily: "'Gambetta', serif" }}>
                          We got your message
                        </h3>
                        <p className="mt-2 text-sm text-black/40">Our team will reach out within 24 hours.</p>
                        <button onClick={reset}
                          className="mt-6 rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-black/45 transition hover:text-black/70">
                          Audit Another
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
