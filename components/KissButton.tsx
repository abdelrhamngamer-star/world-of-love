"use client";
import { useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site-config";

interface Burst { bx: number; by: number; rot: number; s: number }
interface Fall { x: number; heart: boolean; s: number; r: number }
interface Show { id: number; tx: number; ty: number; dx: number; dy: number; r: number; H: number; bursts: Burst[]; falls: Fall[] }
let uid = 0;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

// A lipstick kiss print drawn as SVG (not an emoji)
function Lips({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 70" className={`block ${className}`} style={style} aria-hidden>
      <defs>
        <filter id="lip-rough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" /></filter>
      </defs>
      <g filter="url(#lip-rough)">
        <path d="M10 36C22 22 36 18 50 27C64 18 78 22 90 36C74 40 62 40 50 38C38 40 26 40 10 36Z" fill="#c2294f" />
        <path d="M10 36C26 40 38 40 50 38C62 40 74 40 90 36C80 56 64 62 50 62C36 62 20 56 10 36Z" fill="#b01f45" />
        <path d="M10 36C26 40 38 40 50 38C62 40 74 40 90 36" fill="none" stroke="#6e0f2b" strokeWidth="1.6" />
        <path d="M30 30v8M38 28v9M46 29v8M54 29v8M62 28v9M70 30v8M34 44v10M44 47v11M56 47v11M66 44v10" stroke="#fff" strokeOpacity=".2" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

function Heart({ size }: { size: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z" fill="#e58a9c" /></svg>;
}

export default function KissButton() {
  const [shows, setShows] = useState<Show[]>([]);
  const [count, setCount] = useState(0);
  const ctx = useRef<AudioContext | null>(null);

  const audio = () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const c = (ctx.current ??= new AC());
    void c.resume();
    return c;
  };

  const synth = (v: number) => {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    const n = Math.floor(c.sampleRate * 0.12);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 6;
    f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(2200, t + 0.09);
    const g = c.createGain(); g.gain.setValueAtTime(0.5 * v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(t);
    const o = c.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(900, t + 0.1); o.frequency.exponentialRampToValueAtTime(180, t + 0.2);
    const og = c.createGain(); og.gain.setValueAtTime(0.0001, t); og.gain.setValueAtTime(0.6 * v, t + 0.1); og.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(og); og.connect(c.destination); o.start(t + 0.1); o.stop(t + 0.25);
  };

  const smack = (v: number) => {
    try {
      if (site.kissSound) { if (v === 1) { const a = new Audio(site.kissSound); void a.play().catch(() => synth(v)); } }
      else synth(v);
    } catch { /* sound is optional */ }
  };

  const send = () => {
    audio(); // unlock sound inside the tap
    const W = window.innerWidth, H = window.innerHeight;
    const tx = rnd(28, 72), ty = rnd(26, 56), n = 14;
    const show: Show = {
      id: uid++, tx, ty, H, r: rnd(-18, 18),
      dx: W - 40 - (tx * W) / 100, dy: H - 104 - (ty * H) / 100,
      bursts: Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(-0.2, 0.2), d = rnd(130, 300);
        return { bx: Math.cos(a) * d, by: Math.sin(a) * d, rot: rnd(-60, 60), s: rnd(0.18, 0.34) };
      }),
      falls: Array.from({ length: 12 }, (_, i) => ({ x: rnd(6, 90), heart: i % 3 !== 0, s: rnd(0.9, 1.5), r: rnd(-25, 25) })),
    };
    setCount((c) => c + 1);
    setShows((s) => [...s.slice(-2), show]);
    [1100, 1450, 1620, 1800].forEach((t, i) => setTimeout(() => smack(i === 0 ? 1 : 0.45), t));
    setTimeout(() => setShows((s) => s.filter((x) => x.id !== show.id)), 8200);
  };

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[65] overflow-hidden">
        {shows.map((s) => (
          <div key={s.id}>
            {/* 1) one big kiss flies from the button, grows, sticks to the screen, then slides down */}
            <motion.div className="absolute" style={{ left: `${s.tx}%`, top: `${s.ty}%`, width: 190, marginLeft: -95, marginTop: -66, transformOrigin: "50% 0%" }}
              initial={{ x: s.dx, y: s.dy, scale: 0.25, rotate: s.r - 40 }}
              animate={{ x: [s.dx, 0, 0, 0], y: [s.dy, 0, 0, 170], scale: [0.25, 1.15, 1, 1], scaleY: [1, 1, 1, 1.4], opacity: [1, 1, 1, 0], rotate: [s.r - 40, s.r, s.r, s.r] }}
              transition={{ duration: 4.2, times: [0, 0.26, 0.55, 1], ease: ["easeOut", "linear", "easeIn"] }}>
              <Lips className="w-full drop-shadow-[0_0_18px_rgba(194,41,79,.45)]" />
            </motion.div>
            {/* 2) many small kisses burst out of it */}
            <div className="absolute" style={{ left: `${s.tx}%`, top: `${s.ty}%` }}>
              {s.bursts.map((b, i) => (
                <motion.div key={i} className="absolute" style={{ width: 190 * b.s, marginLeft: -95 * b.s, marginTop: -66 * b.s }} initial={{ opacity: 0 }}
                  animate={{ x: [0, b.bx], y: [0, b.by], scale: [0.2, 1, 0.9], opacity: [0, 1, 0], rotate: [0, b.rot] }}
                  transition={{ delay: 1.2 + i * 0.04, duration: 1.7, ease: "easeOut" }}>
                  <Lips className="w-full" />
                </motion.div>
              ))}
            </div>
            {/* 3) "بحبك" and hearts fall all the way to the bottom */}
            {s.falls.map((f, i) => (
              <motion.div key={i} className="absolute top-0" style={{ left: `${f.x}%` }} initial={{ opacity: 0 }}
                animate={{ y: [-70, -70, s.H - 80, s.H - 120, s.H - 80], opacity: [0, 1, 1, 1, 0], rotate: [f.r, f.r, f.r * 1.5, f.r, f.r] }}
                transition={{ delay: 2.9 + i * 0.16, duration: 3.2, times: [0, 0.05, 0.7, 0.85, 1], ease: ["linear", "easeIn", "easeOut", "easeIn"] }}>
                {f.heart ? <Heart size={26 * f.s} /> : <span className="whitespace-nowrap font-semibold text-gold" style={{ fontSize: `${1.2 * f.s}rem`, textShadow: "0 0 12px rgba(197,161,106,.6)" }}>بحبك</span>}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={send} aria-label="ابعتي بوسة"
        className="fixed bottom-20 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-rose/50 bg-burgundy/90 shadow-[0_0_24px_rgba(214,154,166,.35)] transition active:scale-90">
        <Lips className="w-7" />
        {count > 0 && <span className="absolute -left-1 -top-1 min-w-5 rounded-full bg-gold px-1 text-center text-[11px] text-wine">{count}</span>}
      </button>
    </>
  );
}
