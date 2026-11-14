"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { ChevronUp, Gift, HelpCircle, Mail, Pause, Play, Sparkles, StickyNote, FileText, Shuffle, Volume2, VolumeX, X } from "lucide-react";
import { finale, intro, letter, nav, reasons, roles, surprises } from "@/content/content";
import { site } from "@/content/site-config";
import KissButton from "@/components/KissButton";

const icons = { mail: Mail, paper: FileText, gift: Gift, mystery: HelpCircle, note: StickyNote };

function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 22 }, (_, i) => (
        <span key={i} className="particle" style={{ left: `${(i * 37) % 100}%`, width: 2 + (i % 3), height: 2 + (i % 3), animationDelay: `${(i * 0.9) % 9}s`, animationDuration: `${9 + (i % 5) * 3}s` }} />
      ))}
    </div>
  );
}

function Fade({ d, children, className = "" }: { d: number; children: ReactNode; className?: string }) {
  return <motion.p className={className} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d, duration: 1.2 }}>{children}</motion.p>;
}

function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mx-auto mb-12 max-w-xl text-center">
      <h2 className="text-3xl font-semibold leading-snug text-champagne md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 leading-loose text-rose/90">{sub}</p>}
    </header>
  );
}

function Modal({ open, onClose, title, text }: { open: boolean; onClose: () => void; title: string; text: string }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, y: 30, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.92, opacity: 0 }}
            className="relative w-full max-w-md rounded-3xl border border-gold/30 bg-gradient-to-b from-burgundy to-wine p-8 pt-12 text-center shadow-2xl">
            <button autoFocus aria-label="إغلاق" onClick={onClose} className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full text-champagne hover:bg-white/10"><X size={20} /></button>
            <h3 className="mb-5 text-xl font-semibold text-gold">{title}</h3>
            <p className="text-lg leading-loose text-ivory">{text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LetterAudio({ src }: { src: string }) {
  const r = useRef<HTMLAudioElement>(null);
  const [ok, setOk] = useState(true);
  const [p, setP] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  if (!ok) return null;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const toggle = () => {
    const a = r.current;
    if (!a) return;
    if (p) { a.pause(); setP(false); } else a.play().then(() => setP(true)).catch(() => setOk(false));
  };
  return (
    <div className="mt-6 flex items-center gap-3 rounded-full border border-wine/20 bg-wine/5 px-3 py-2 text-wine">
      <audio ref={r} src={src} preload="metadata" onError={() => setOk(false)} onEnded={() => setP(false)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setD(e.currentTarget.duration)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} />
      <button onClick={toggle} aria-label={p ? "إيقاف مؤقت" : "تشغيل التسجيل"} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-burgundy text-ivory">{p ? <Pause size={18} /> : <Play size={18} />}</button>
      <input type="range" aria-label="شريط التقدم" className="h-1 w-full accent-[#3b101d]" min={0} max={d || 1} step={0.1} value={t}
        onChange={(e) => { if (r.current) r.current.currentTime = Number(e.target.value); }} />
      <span className="shrink-0 text-xs tabular-nums" dir="ltr">{fmt(t)} / {fmt(d)}</span>
    </div>
  );
}

export default function Experience() {
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [roleOpen, setRoleOpen] = useState<number | null>(null);
  const [surOpen, setSurOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const [cur, setCur] = useState<number | null>(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [noAudio, setNoAudio] = useState(false);
  const au = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => { document.body.style.overflow = entered ? "" : "hidden"; }, [entered]);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -45% 0px" });
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const enter = () => {
    setEntered(true);
    setTimeout(() => go("roles"), 700);
    const a = au.current;
    if (a) {
      a.volume = 0.7;
      a.play().then(() => setOn(true)).catch(() => setNoAudio(true));
    }
  };
  const toggleMusic = () => {
    const a = au.current;
    if (!a || noAudio) return;
    if (on) { a.pause(); setOn(false); } else a.play().then(() => setOn(true)).catch(() => setNoAudio(true));
  };
  const reveal = (i: number) => { setCur(i); setSeen((s) => (s.includes(i) ? s : [...s, i])); };
  const random = () => {
    const left = reasons.map((_, i) => i).filter((i) => !seen.includes(i));
    reveal(left.length ? left[Math.floor(Math.random() * left.length)] : Math.floor(Math.random() * reasons.length));
  };
  const sur = surOpen !== null ? surprises[surOpen] : null;
  const role = roleOpen !== null ? roles[roleOpen] : null;

  return (
    <MotionConfig reducedMotion="user">
      <audio ref={au} src={site.audio} loop preload="none" onError={() => setNoAudio(true)} />
      <motion.div aria-hidden style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-right bg-gold" />
      <button onClick={toggleMusic} disabled={noAudio} aria-pressed={on} aria-label={noAudio ? "ملف الموسيقى غير متاح" : on ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        title={noAudio ? "مفيش ملف موسيقى" : undefined}
        className="fixed left-4 top-4 z-[70] grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-wine/80 text-champagne backdrop-blur disabled:opacity-40">
        {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      <AnimatePresence>
        {!entered && (
          <motion.section id="intro" aria-label="المقدمة" exit={{ opacity: 0, scale: 1.1, filter: "blur(14px)" }} transition={{ duration: 1 }}
            className="fixed inset-0 z-50 grid place-items-center bg-[radial-gradient(ellipse_at_50%_40%,#4a1626_0%,#210b13_55%,#0b0306_100%)] px-6 text-center">
            <Particles />
            <div className="relative max-w-xl space-y-6">
              <Fade d={0.5} className="text-2xl leading-loose text-champagne md:text-3xl">{intro.lines[0]}</Fade>
              <Fade d={2.2} className="text-lg leading-loose text-rose md:text-xl">{intro.lines[1]}</Fade>
              <Fade d={4.2} className="text-xl font-semibold text-gold">{intro.lines[2]}</Fade>
              <motion.button onClick={enter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5.4, duration: 1 }}
                className="mt-4 min-h-12 rounded-full border border-gold bg-gold/10 px-8 text-lg text-champagne shadow-[0_0_40px_rgba(197,161,106,.25)] transition hover:bg-gold/25">
                {intro.cta}
              </motion.button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <main className="relative">
        <section id="roles" className="scroll-mt-4 px-5 py-28">
          <Heading title="أكتر من وش للحب" sub="الحب مش دور واحد. افتحي كل باب." />
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {roles.map((r, i) => (
              <motion.button key={r.id} onClick={() => setRoleOpen(i)} whileHover={{ y: -8 }} whileTap={{ scale: 0.97 }}
                className={`${r.shape} group relative flex h-72 flex-col items-center justify-end rounded-t-[7rem] rounded-b-2xl border border-gold/30 bg-gradient-to-b ${r.tone} p-5 text-center`}>
                <span aria-hidden className="absolute top-10 h-16 w-16 rounded-full bg-gold/20 blur-xl transition group-hover:bg-gold/50" />
                <span className="text-2xl font-semibold text-champagne">{r.title}</span>
                <span className="mt-1 text-sm text-rose">{r.desc}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="reasons" className="scroll-mt-4 px-5 py-28">
          <Heading title="سبب بعد سبب يخلّوني أحبك أكتر" sub={`اكتشفتي ${seen.length} من ${reasons.length}`} />
          <div className="mx-auto max-w-4xl">
            <div aria-live="polite" className="mb-8 grid min-h-36 place-items-center rounded-3xl border border-gold/30 bg-burgundy/60 p-6 text-center">
              <AnimatePresence mode="wait">
                <motion.p key={cur ?? "none"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xl leading-loose text-champagne">
                  {cur === null ? "اختاري رقم، أو سيبيها للصدفة." : reasons[cur]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mb-6 flex justify-center">
              <button onClick={random} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/50 px-6 text-champagne hover:bg-gold/15">
                <Shuffle size={16} /> {seen.length === reasons.length ? "اقري سبب تاني" : "سبب عشوائي"}
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
              {reasons.map((_, i) => (
                <motion.button key={i} onClick={() => reveal(i)} aria-label={`السبب رقم ${i + 1}`} aria-pressed={seen.includes(i)}
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 10) * 0.04 }}
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.93 }}
                  className={`aspect-square rounded-xl border text-sm transition ${cur === i ? "border-gold bg-gold text-wine" : seen.includes(i) ? "border-rose/50 bg-rose/20 text-champagne" : "border-gold/25 bg-wine text-gold/80"}`}>
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section id="letter" className="scroll-mt-4 px-5 py-28">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-8 text-xl leading-loose text-champagne">{letter.seal}</p>
            <div className="relative mx-auto h-44 w-72 max-w-full">
              <div className="absolute inset-0 rounded-b-xl rounded-t-md bg-gradient-to-b from-[#6b2a3a] to-burgundy shadow-2xl" />
              <motion.div style={{ transformOrigin: "top", backfaceVisibility: "hidden" }} animate={{ rotateX: letterOpen ? 180 : 0 }} transition={{ duration: 0.8 }}
                className="absolute inset-x-0 top-0 h-24 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[#7a3347]" />
              {!letterOpen && (
                <button onClick={() => setLetterOpen(true)} aria-label={letter.cta} className="absolute left-1/2 top-[4.5rem] grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full bg-gold text-wine shadow-lg ring-4 ring-gold/30"><Sparkles size={22} /></button>
              )}
            </div>
            {!letterOpen && <p className="mt-8 text-gold">{letter.cta}</p>}
            <AnimatePresence>
              {letterOpen && (
                <motion.article initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}
                  className="mt-10 rounded-sm bg-ivory p-7 text-right text-wine shadow-2xl md:p-10">
                  {letter.paragraphs.map((p, i) => (
                    <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.45, duration: 0.8 }} className="mb-5 text-lg leading-[2.1] last:mb-0">{p}</motion.p>
                  ))}
                  {letter.audio && <LetterAudio src={letter.audio} />}
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section id="surprises" className="scroll-mt-4 px-5 py-28">
          <Heading title="مفاجآت صغيرة" sub="كل واحدة ليها وقتها." />
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-5">
            {surprises.map((s, i) => {
              const Icon = icons[s.icon];
              return (
                <motion.button key={s.id} onClick={() => setSurOpen(i)} whileHover={{ y: -6, rotate: 0 }} whileTap={{ scale: 0.95 }}
                  className={`${s.shape} flex h-40 w-40 flex-col items-center justify-center gap-3 border border-gold/40 bg-gradient-to-br from-burgundy to-wine p-4 text-center text-sm text-champagne`}>
                  <Icon size={26} className="text-gold" aria-hidden />
                  {s.label}
                </motion.button>
              );
            })}
          </div>
        </section>

        <section id="finale" className="flex min-h-screen scroll-mt-4 flex-col items-center justify-center bg-gradient-to-b from-wine via-burgundy to-[#0b0306] px-6 py-28 text-center">
          <div className="max-w-xl space-y-10">
            {[finale.l1, finale.l2, finale.l3].map((l, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20%" }} transition={{ delay: i * 1.6, duration: 1.4 }}
                className={i === 1 ? "text-3xl font-semibold leading-relaxed text-champagne" : "text-lg leading-loose text-rose"}>{l}</motion.p>
            ))}
          </div>
          <div aria-hidden className="relative mx-auto mt-16 h-40 w-40">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="absolute inset-0 rounded-full border border-gold/40" animate={{ scale: [0.4, 1.6], opacity: [0.7, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }} />
            ))}
            <span className="absolute inset-[42%] rounded-full bg-gold shadow-[0_0_60px_20px_rgba(197,161,106,.5)]" />
          </div>
          <button onClick={() => go("roles")} className="mt-14 min-h-12 rounded-full border border-gold/60 px-8 text-champagne hover:bg-gold/15">{finale.back}</button>
        </section>
      </main>

      {entered && (
        <nav aria-label="التنقل" className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[94vw] gap-1 rounded-full border border-gold/30 bg-wine/85 p-1 backdrop-blur">
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} aria-current={active === n.id ? "true" : undefined}
              className={`min-h-10 rounded-full px-3 text-xs transition sm:px-4 sm:text-sm ${active === n.id ? "bg-gold text-wine" : "text-champagne hover:bg-white/10"}`}>{n.label}</button>
          ))}
        </nav>
      )}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="للأعلى" className="fixed bottom-20 left-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-wine/85 text-champagne"><ChevronUp size={20} /></button>
      )}

      {entered && <KissButton />}
      <Modal open={!!role} onClose={() => setRoleOpen(null)} title={role?.title ?? ""} text={role?.message ?? ""} />
      <Modal open={!!sur} onClose={() => setSurOpen(null)} title={sur?.label ?? ""} text={sur?.message ?? ""} />
    </MotionConfig>
  );
}
