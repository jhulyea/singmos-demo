import { useEffect, useMemo, useRef, useState } from "react";

const FRIENDS = [
  { src: "/memes/zhengseng.png", alt: "Zhengseng" },
  { src: "/memes/yikhuen.png", alt: "Yikhuen" },
  { src: "/memes/gabriel.png", alt: "Gabriel" },
  { src: "/memes/brejesh.png", alt: "Brejesh" },
];

/* =======================
   OPTION C: MOS -> REACTION
   ======================= */
function getReactionTier(mos) {
  const x = Number(mos);
  if (!Number.isFinite(x)) return "idle";
  if (x < 1.8) return "bad";
  if (x < 3.5) return "ok";
  return "good";
}

const JUDGE_ASSETS = {
  idle: "/memes/haroldwaiting.jpg",
  bad: "/memes/haroldbad.jpg",
  ok: "/memes/haroldok.jpg",
  good: "/memes/haroldgood.jpg",
};

const NPC_ASSETS = {
  idle: "/memes/disco/catwaiting.jpeg",
  bad: "/memes/disco/oia-uia.gif",
  ok: "/memes/disco/oia-uia.gif",
  good: "/memes/disco/oia-uia.gif",
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/* (kept) your overall “show tier” for vibes + theme */
function tierFromMos(mos) {
  if (mos >= 4.0) return "legend";
  if (mos >= 3.3) return "good";
  if (mos >= 2.5) return "mid";
  return "cooked";
}

function stageImageForTier(tier) {
  // Put these in: frontend/public/memes/
  // - stage-red.jpg
  // - stage-blue.jpg
  const isHot = tier === "cooked";
  const isCool = tier === "legend" || tier === "good";
  return isHot
    ? "/memes/stage-red.jpg"
    : isCool
    ? "/memes/stage-blue.jpg"
    : "/memes/stage-blue.jpg";
}

/* =======================
   GOLD MIC (INLINE SVG)
   ======================= */
function GoldMicIcon({ size = 110 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="35%" stopColor="#FFD166" />
          <stop offset="70%" stopColor="#D4A018" />
          <stop offset="100%" stopColor="#FFF3C4" />
        </linearGradient>
        <linearGradient id="goldGrad2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#C98B10" />
          <stop offset="50%" stopColor="#FFD166" />
          <stop offset="100%" stopColor="#FFF0B2" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="70"
        cy="70"
        r="60"
        fill="rgba(255,209,102,0.12)"
        filter="url(#glow)"
      />
      <circle
        cx="70"
        cy="70"
        r="58"
        fill="none"
        stroke="rgba(255,209,102,0.35)"
        strokeWidth="2"
      />

      <rect
        x="48"
        y="26"
        width="44"
        height="64"
        rx="22"
        fill="url(#goldGrad)"
        stroke="rgba(255,255,255,0.35)"
      />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={i}
          x={54}
          y={34 + i * 7}
          width={32}
          height={2.5}
          rx={2}
          fill="rgba(0,0,0,0.25)"
          opacity={0.35}
        />
      ))}

      <rect x="64" y="92" width="12" height="18" rx="6" fill="url(#goldGrad2)" />
      <rect x="50" y="110" width="40" height="10" rx="5" fill="url(#goldGrad2)" />
      <rect x="42" y="120" width="56" height="8" rx="4" fill="rgba(0,0,0,0.25)" opacity="0.35" />
    </svg>
  );
}

/* =======================
   CURVED RAINBOW TITLE (SVG)
   ======================= */
function CurvedRainbowTitle({ text = "DAP GOT TALENT" }) {
  return (
    <svg
      viewBox="0 0 1200 180"
      width="min(920px, 90vw)"
      height="100"
      aria-label={text}
      style={{ display: "block", margin: "0 auto" }}
    >
      <defs>
        <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="20%" stopColor="#ffd166" />
          <stop offset="40%" stopColor="#8cff98" />
          <stop offset="60%" stopColor="#5eead4" />
          <stop offset="80%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ff4d6d" />
        </linearGradient>

        <filter id="titleGlow" x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <path id="arc" d="M 110 135 Q 600 15 1090 135" />
      </defs>

      {/* soft back glow */}
      <path
        d="M 110 135 Q 600 15 1090 135"
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="18"
      />

      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight="1000"
        fontSize="105"
        letterSpacing="10"
        fill="url(#rainbow)"
        filter="url(#titleGlow)"
      >
        <textPath href="#arc" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>

      {/* thin highlight stroke */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight="1000"
        fontSize="78"
        letterSpacing="10"
        fill="none"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="2"
      >
        <textPath href="#arc" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/* =======================
   FIREWORKS (CSS-only sparks)
   ======================= */
function Fireworks({ k = 0 }) {
  const bursts = useMemo(() => {
    const rnd = () => Math.random();
    const colors = ["#ff4d6d", "#ffd166", "#8cff98", "#5eead4", "#7c3aed", "#ffffff"];
    return Array.from({ length: 6 }).map(() => ({
      x: 12 + rnd() * 76, // percent
      y: 18 + rnd() * 52, // percent
      c: colors[Math.floor(rnd() * colors.length)],
      d: 0.05 + rnd() * 0.25, // delay
      s: 0.85 + rnd() * 0.55, // scale
    }));
  }, [k]);

  return (
    <div className="fwWrap" aria-hidden="true">
      {bursts.map((b, i) => (
        <div
          key={i}
          className="burst"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            "--c": b.c,
            "--d": `${b.d}s`,
            "--s": b.s,
          }}
        >
          {Array.from({ length: 10 }).map((_, j) => (
            <i key={j} className="spark" style={{ "--a": `${j * 36}deg` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* =======================
   ORBIT GROUP (reusable)
   ======================= */
function OrbitGroup({ a, b, dir = "normal", className = "" }) {
  return (
    <div className={`orbitWrap ${className}`}>
      <div className={`orbit orbitSlow ${dir === "reverse" ? "orbitReverse" : ""}`}>
        <img className="orbitPic" src={a.src} alt={a.alt} draggable="false" />
        <img className="orbitPic" src={b.src} alt={b.alt} draggable="false" />
      </div>
    </div>
  );
}

export default function App() {
  const fileRef = useRef(null);

  // Recording helpers
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const stopTimerRef = useRef(null);

  const [mos, setMos] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [msg, setMsg] = useState("drop your clip. we judge.");
  const [err, setErr] = useState("");

  // animated display numbers
  const [dispMos, setDispMos] = useState(null);
  const [dispScore, setDispScore] = useState(null);

  // fireworks trigger
  const [boom, setBoom] = useState(false);
  const [boomKey, setBoomKey] = useState(0);

  const tier = useMemo(() => {
    if (mos == null) return "idle";
    return tierFromMos(mos);
  }, [mos]);

  const reactionTier = useMemo(() => getReactionTier(mos), [mos]);
  const judgeImg = useMemo(
    () => JUDGE_ASSETS[reactionTier] || JUDGE_ASSETS.idle,
    [reactionTier]
  );
  const npcImg = useMemo(
    () => NPC_ASSETS[reactionTier] || NPC_ASSETS.idle,
    [reactionTier]
  );

  const face = useMemo(() => {
    if (tier === "legend") return { who: "CAT JUDGE 😼✨", vibe: "VOCALS ARE ILLEGAL" };
    if (tier === "good") return { who: "UNCLE JUDGE 🕺", vibe: "okayy not bad ah" };
    if (tier === "mid") return { who: "NPC JUDGE 😐", vibe: "passable. can." };
    if (tier === "cooked") return { who: "AUNTIE JUDGE 💀", vibe: "pls practice hor" };
    return { who: "DAP GOT TALENT 🎤", vibe: "drop your clip. we judge." };
  }, [tier]);

  // Animate MOS + score tally up, then pop fireworks
  useEffect(() => {
    if (mos == null && score == null) {
      setDispMos(null);
      setDispScore(null);
      return;
    }

    const startMos = Number.isFinite(Number(dispMos)) ? Number(dispMos) : mos ?? 0;
    const startScore = Number.isFinite(Number(dispScore)) ? Number(dispScore) : score ?? 0;

    const endMos = mos ?? startMos;
    const endScore = score ?? startScore;

    const dur = 700; // ms
    const t0 = performance.now();
    let raf = 0;

    setBoom(false);

    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      // easeOutCubic
      const e = 1 - Math.pow(1 - p, 3);

      const curMos = startMos + (endMos - startMos) * e;
      const curScore = startScore + (endScore - startScore) * e;

      setDispMos(curMos);
      setDispScore(Math.round(curScore));

      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        // lock exact values
        setDispMos(endMos);
        setDispScore(endScore);

        // FIREWORKS POP
        setBoomKey((x) => x + 1);
        setBoom(true);
        window.setTimeout(() => setBoom(false), 1100);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mos, score]);

  async function scoreFile(file) {
    if (!file) return;
    setErr("");
    setLoading(true);
    setMsg("JUDGING…");

    try {
      const fd = new FormData();
      fd.append("audio", file);

      const res = await fetch("http://127.0.0.1:5050/score", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Scoring failed");

      setMos(data.mos);
      setScore(data.score_1_to_5);
      setLoading(false);
      setMsg("done.");
    } catch (e) {
      setLoading(false);
      setErr(e.message || String(e));
      setMsg("error.");
    }
  }

  function onPick() {
    fileRef.current?.click();
  }

  function onChange(e) {
    const f = e.target.files?.[0];
    if (f) scoreFile(f);
  }

  async function startRecording(seconds = 7) {
    setErr("");
    setMsg("requesting mic…");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErr("Your browser doesn't support microphone recording.");
      setMsg("error.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      recorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const file = new File([blob], "recording.webm", { type: blob.type });

        setRecording(false);
        setMsg("uploading…");
        await scoreFile(file);
      };

      mr.start();
      setRecording(true);
      setMsg(`recording… (${seconds}s)`);

      stopTimerRef.current = window.setTimeout(() => {
        if (mr.state === "recording") mr.stop();
      }, seconds * 1000);
    } catch (e) {
      setErr(e.message || String(e));
      setMsg("mic blocked 😭 allow mic in browser");
    }
  }

  function stopRecordingNow() {
    const mr = recorderRef.current;
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (mr && mr.state === "recording") mr.stop();
  }

  const pct = mos == null ? 0 : clamp((mos - 1) / 4, 0, 1) * 100;

  return (
    <div style={styles.page(tier)}>
      {/* Global CSS animations */}
      <style>{css}</style>

      {/* TOP BANNER (TIGHT + LEFT/RIGHT ORBITS) */}
      <header style={styles.bannerWrap}>
        <div style={styles.curtainLeft} />
        <div style={styles.curtainRight} />

        <div style={styles.banner}>
          <div style={styles.bannerTopRow}>
            <span style={styles.bannerTag}>LIVE</span>
            <span style={styles.bannerTiny}>local AI judge • mos 1–5</span>
          </div>

          {/* Put RIGHT orbit back inside the title row grid */}
          <div style={styles.bannerTitleRow}>
            <OrbitGroup a={FRIENDS[0]} b={FRIENDS[1]} dir="normal" className="orbitLeft" />

            <div style={styles.titleCenter}>
              <CurvedRainbowTitle text="DAP GOT TALENT" />
            </div>

            <OrbitGroup a={FRIENDS[2]} b={FRIENDS[3]} dir="reverse" className="orbitRight" />
          </div>

          <div style={styles.bannerSub}>
            <span style={styles.bannerSubText}>upload or record • we judge instantly • hahaha</span>
          </div>
        </div>

        <div style={styles.bulbRow} />
      </header>

      {/* MAIN STAGE */}
      <main style={styles.center}>
        <div style={styles.stageFrame(tier)}>
          <div style={styles.stageLights} />
          <div style={styles.spotlight} />

          <div style={styles.grid}>
            {/* LEFT: judge meme */}
            <section style={styles.panelLeft}>
              <div style={styles.panelTitle}>THE JUDGE</div>

              <div style={styles.avatar(tier)}>
                {(recording || loading) && <div className="discoLayer" />}

                {/* BIGGER CAT overlay sticker */}
                <div style={styles.catStickerWrap}>
                  <img
                    key={reactionTier}
                    src={npcImg}
                    alt="npc"
                    style={styles.catSticker}
                    draggable="false"
                    onError={() => console.log("❌ npcImg failed:", npcImg)}
                  />
                </div>

                {(recording || loading) ? (
                  <img
                    src={NPC_ASSETS.idle}
                    alt="npc waiting"
                    draggable="false"
                    onError={() => console.log("❌ NPC idle failed:", NPC_ASSETS.idle)}
                    style={styles.bigAvatarImg}
                  />
                ) : (
                  <img
                    key={reactionTier}
                    src={judgeImg}
                    alt="judge reaction"
                    draggable="false"
                    onError={() => console.log("❌ judgeImg failed:", judgeImg)}
                    style={styles.bigAvatarImg}
                  />
                )}

                {dispScore != null && <div className="scoreBadge">{dispScore}/5</div>}
              </div>

              <div style={styles.judgeLine}>
                <div style={styles.judgeWho}>{face.who}</div>
                <div style={styles.judgeVibe}>{face.vibe}</div>
              </div>
            </section>

            {/* CENTER: big mic */}
            <section style={styles.panelCenter}>
              <div style={styles.panelTitleCenter}>THE STAGE</div>

              <button
                onClick={onPick}
                disabled={loading || recording}
                style={styles.megaMicBtn(loading || recording, tier)}
                title="Upload audio (m4a/mp3/wav/webm)"
              >
                <div style={styles.megaMicRing(tier)} />
                <div style={styles.megaMicSpot} />

                <div style={styles.megaMicIconWrap}>
                  <GoldMicIcon size={122} />
                </div>

                <div style={styles.megaMicText}>
                  {loading ? "JUDGING..." : recording ? "RECORDING..." : "TAP TO SING"}
                </div>
                <div style={styles.megaMicSub}>click to upload</div>
              </button>

              <input ref={fileRef} type="file" accept="audio/*" onChange={onChange} style={{ display: "none" }} />

              <div style={styles.controlsRow}>
                {!recording ? (
                  <button
                    onClick={() => startRecording(7)}
                    disabled={loading}
                    style={miniBtn}
                    title="Records 7 seconds then scores automatically"
                  >
                    ⏺️ RECORD 7s
                  </button>
                ) : (
                  <button onClick={stopRecordingNow} style={miniBtnDanger}>
                    ⏹️ STOP
                  </button>
                )}

                <div style={styles.statusPill}>
                  <span style={styles.statusDot(recording, loading)} />
                  <span style={styles.statusText}>{recording ? "recording" : loading ? "scoring" : "ready"}</span>
                </div>
              </div>

              <div style={styles.helperText}>Tip: 5–10 seconds is enough • sing loud • don’t whisper</div>
            </section>

            {/* RIGHT: scoreboard */}
            <section style={styles.panelRight}>
              <div style={styles.panelTitle}>SCOREBOARD</div>

              <div style={styles.card}>
                {boom && <Fireworks k={boomKey} />}

                <div style={styles.row}>
                  <div>
                    <div style={styles.label}>MOS</div>
                    <div style={styles.value}>{dispMos == null ? "--" : Number(dispMos).toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={styles.label}>1–5</div>
                    <div style={styles.value}>{dispScore == null ? "--" : dispScore}</div>
                  </div>
                </div>

                <div style={styles.meter}>
                  <div style={styles.meterFill(pct)} />
                </div>

                <div style={styles.hint}>{msg}</div>
                {err && <div style={styles.err}>Error: {err}</div>}
              </div>

              <div style={styles.smallNote}>Powered by your SingMOS model (z → MOS).</div>
            </section>
          </div>

          <div style={styles.stageFloor} />
        </div>
      </main>
    </div>
  );
}

/* =======================
   BUTTON STYLES
   ======================= */
const miniBtn = {
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  padding: "10px 14px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 900,
  letterSpacing: "0.08em",
};

const miniBtnDanger = {
  ...miniBtn,
  border: "1px solid rgba(255,77,109,0.35)",
  background: "rgba(255,77,109,0.16)",
};

/* =======================
   MAIN STYLES
   ======================= */
const styles = {
  page: (tier) => {
    const isHot = tier === "cooked";
    const isCool = tier === "legend" || tier === "good";
    return {
      minHeight: "100vh",
      padding: 0,
      color: "rgba(255,255,255,0.92)",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      background: isHot
        ? "radial-gradient(1600px 900px at 50% 0%, #5a0b1c 0%, #12060a 55%, #07070d 100%)"
        : isCool
        ? "radial-gradient(1600px 900px at 50% 0%, #061a5c 0%, #050818 55%, #07070d 100%)"
        : "radial-gradient(1600px 900px at 50% 0%, #2b1247 0%, #0b0b12 55%, #07070d 100%)",
    };
  },

  /* ====== TIGHTER TOP (so stage grows) ====== */
  bannerWrap: {
    position: "relative",
    padding: "10px 16px 6px", // tighter than before
    overflow: "hidden",
  },
  banner: {
    width: "min(1480px, 96vw)",
    margin: "0 auto",
    borderRadius: 22,
    padding: "10px 14px 8px", // tighter than before
    border: "1px solid rgba(255,255,255,0.16)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.05))",
    boxShadow: "0 18px 70px rgba(0,0,0,0.45)",
    position: "relative",
  },
  bannerTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  bannerTag: {
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: "0.14em",
    padding: "7px 11px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255, 77, 109, 0.18)",
  },
  bannerTiny: { color: "rgba(255,255,255,0.70)", fontSize: 12 },

  bannerTitleRow: {
    marginTop: 2,
    display: "grid",
    gridTemplateColumns: "minmax(170px, 220px) 1fr minmax(170px, 220px)", // responsive-ish
    alignItems: "center",
    gap: 10,
  },

  titleCenter: {
    display: "grid",
    justifyItems: "center",
  },

  bannerSub: { marginTop: 2, textAlign: "center" },
  bannerSubText: { color: "rgba(255,255,255,0.72)", fontSize: 12, letterSpacing: "0.06em" },

  bulbRow: {
    width: "min(1480px, 96vw)",
    margin: "6px auto 0",
    height: 9,
    borderRadius: 999,
    background:
      "repeating-linear-gradient(90deg, rgba(255,209,102,0.95) 0 8px, rgba(255,209,102,0.00) 8px 18px)",
    filter: "drop-shadow(0 8px 18px rgba(255,209,102,0.18))",
    opacity: 0.9,
  },

  curtainLeft: {
    position: "absolute",
    top: -95,
    left: -40,
    width: 260,
    height: 330,
    transform: "rotate(6deg)",
    borderRadius: 40,
    background: "linear-gradient(180deg, rgba(255,0,80,0.34), rgba(120,0,40,0.10))",
    opacity: 0.9,
    boxShadow: "0 40px 140px rgba(255,0,80,0.15)",
  },
  curtainRight: {
    position: "absolute",
    top: -95,
    right: -40,
    width: 260,
    height: 330,
    transform: "rotate(-6deg)",
    borderRadius: 40,
    background: "linear-gradient(180deg, rgba(255,0,80,0.34), rgba(120,0,40,0.10))",
    opacity: 0.9,
    boxShadow: "0 40px 140px rgba(255,0,80,0.15)",
  },

  /* stage */
  center: {
    width: "min(1480px, 96vw)",
    margin: "0 auto",
    padding: "8px 0 28px",
  },

  stageFrame: (tier) => ({
    position: "relative",
    width: "100%",
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.14)",
    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.70)), url('${stageImageForTier(tier)}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 24px 90px rgba(0,0,0,0.50)",
    overflow: "hidden",
    padding: 18,
  }),

  stageLights: {
    position: "absolute",
    inset: -60,
    background:
      "radial-gradient(circle at 20% 0%, rgba(255,77,109,0.22), transparent 45%)," +
      "radial-gradient(circle at 80% 0%, rgba(94,234,212,0.18), transparent 45%)," +
      "radial-gradient(circle at 50% 0%, rgba(255,209,102,0.20), transparent 55%)",
    filter: "blur(8px)",
    pointerEvents: "none",
  },
  spotlight: {
    position: "absolute",
    left: "50%",
    top: 0,
    width: 680,
    height: 560,
    transform: "translateX(-50%)",
    background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.22), transparent 62%)",
    filter: "blur(2px)",
    pointerEvents: "none",
  },

  grid: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "minmax(300px, 360px) 1fr minmax(340px, 420px)",
    gap: 16,
    alignItems: "start",
  },

  panelLeft: { display: "grid", gap: 10 },
  panelCenter: { display: "grid", gap: 12, justifyItems: "center" },
  panelRight: { display: "grid", gap: 10 },

  panelTitle: {
    fontSize: 12,
    letterSpacing: "0.14em",
    color: "rgba(255,255,255,0.78)",
    fontWeight: 900,
    paddingLeft: 6,
  },
  panelTitleCenter: {
    fontSize: 12,
    letterSpacing: "0.14em",
    color: "rgba(255,255,255,0.78)",
    fontWeight: 900,
  },

  judgeLine: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.28)",
    borderRadius: 18,
    padding: "12px 14px",
    backdropFilter: "blur(10px)",
  },
  judgeWho: { fontWeight: 1000, fontSize: 14, letterSpacing: "0.08em" },
  judgeVibe: { marginTop: 6, color: "rgba(255,255,255,0.70)", fontSize: 13 },

  /* BIG GOLD MIC BUTTON */
  megaMicBtn: (disabled, tier) => {
    const isHot = tier === "cooked";
    const isCool = tier === "legend" || tier === "good";
    const aura = isHot ? "rgba(255,77,109,0.22)" : isCool ? "rgba(94,234,212,0.20)" : "rgba(255,209,102,0.20)";
    return {
      width: "min(720px, 100%)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: 34,
      padding: "42px 26px",
      background: "radial-gradient(900px 420px at 50% 0%, rgba(255,209,102,0.26), rgba(255,255,255,0.06))",
      boxShadow:
        "0 26px 90px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,209,102,0.20) inset, 0 0 55px " + aura,
      color: "rgba(255,255,255,0.92)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.78 : 1,
      position: "relative",
      overflow: "hidden",
      display: "grid",
      justifyItems: "center",
      gap: 10,
      backdropFilter: "blur(8px)",
    };
  },

  megaMicRing: (tier) => {
    const isHot = tier === "cooked";
    const isCool = tier === "legend" || tier === "good";
    const ring = isHot
      ? "conic-gradient(from 0deg, transparent, rgba(255,77,109,0.30), transparent)"
      : isCool
      ? "conic-gradient(from 0deg, transparent, rgba(94,234,212,0.28), transparent)"
      : "conic-gradient(from 0deg, transparent, rgba(255,209,102,0.28), transparent)";
    return {
      position: "absolute",
      inset: -80,
      background: ring,
      animation: "spin 1.4s linear infinite",
      opacity: 0.42,
    };
  },

  megaMicSpot: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(360px 240px at 50% 22%, rgba(255,255,255,0.16), transparent 70%)",
    pointerEvents: "none",
  },

  megaMicIconWrap: {
    position: "relative",
    filter:
      "drop-shadow(0 28px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 22px rgba(255,209,102,0.30))",
    transform: "translateY(-2px)",
  },

  megaMicText: {
    fontWeight: 1000,
    fontSize: 26,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    position: "relative",
    textShadow: "0 12px 32px rgba(0,0,0,0.45)",
  },
  megaMicSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    letterSpacing: "0.08em",
    position: "relative",
  },

  controlsRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.20)",
    backdropFilter: "blur(8px)",
  },
  statusDot: (recording, loading) => ({
    width: 10,
    height: 10,
    borderRadius: 99,
    background: recording
      ? "rgba(255,77,109,0.95)"
      : loading
      ? "rgba(255,209,102,0.95)"
      : "rgba(140,255,152,0.90)",
    boxShadow: recording
      ? "0 0 16px rgba(255,77,109,0.55)"
      : loading
      ? "0 0 16px rgba(255,209,102,0.45)"
      : "0 0 16px rgba(140,255,152,0.40)",
  }),
  statusText: {
    fontWeight: 900,
    letterSpacing: "0.10em",
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
  },

  helperText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12,
    letterSpacing: "0.06em",
    textAlign: "center",
    marginTop: 4,
    textShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },

  stageFloor: {
    marginTop: 16,
    height: 14,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(255,77,109,0.18), rgba(255,209,102,0.16), rgba(94,234,212,0.14))",
    border: "1px solid rgba(255,255,255,0.10)",
    opacity: 0.9,
    backdropFilter: "blur(6px)",
  },

  avatar: (tier) => ({
    position: "relative",
    height: 310,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
    boxShadow:
      tier === "legend"
        ? "0 18px 80px rgba(255, 209, 102, 0.22)"
        : tier === "cooked"
        ? "0 18px 80px rgba(255, 77, 109, 0.18)"
        : "0 18px 60px rgba(0,0,0,0.35)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  }),

  bigAvatarImg: { width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.02)" },

  catStickerWrap: {
    position: "absolute",
    right: 10,
    bottom: 10,
    zIndex: 5,
    pointerEvents: "none",
  },
  catSticker: {
    width: 140,
    height: 140,
    objectFit: "cover",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(0,0,0,0.18)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
  },

  card: {
    position: "relative",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 24,
    background: "rgba(0,0,0,0.26)",
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    overflow: "hidden",
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  label: { color: "rgba(255,255,255,0.72)", fontSize: 12, letterSpacing: "0.08em" },
  value: {
    fontSize: 34,
    fontWeight: 900,
    marginTop: 4,
    textShadow: "0 12px 28px rgba(0,0,0,0.45)",
  },

  meter: {
    height: 10,
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
    overflow: "hidden",
    margin: "14px 0",
  },
  meterFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #ff4d6d, #ffd166, #8cff98, #5eead4)",
  }),

  hint: { color: "rgba(255,255,255,0.72)", fontSize: 13, marginTop: 6 },
  err: {
    marginTop: 10,
    color: "#ffd1d1",
    background: "rgba(255, 77, 109, 0.14)",
    border: "1px solid rgba(255, 77, 109, 0.25)",
    padding: "10px 12px",
    borderRadius: 14,
    fontSize: 13,
  },
  smallNote: { color: "rgba(255,255,255,0.62)", fontSize: 12, paddingLeft: 6 },
};

/* =======================
   CSS KEYFRAMES (spin + fireworks)
   ======================= */
const css = `
@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}

/* ===== FRIEND ORBIT ===== */
.orbitWrap{
  display:flex;
  justify-content:center;
  align-items:center;
  min-width: 170px;
}

.orbit{
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  animation: orbit 8s linear infinite;
  will-change: transform;
}

.orbitReverse{
  animation-direction: reverse;
}

@keyframes orbit{
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* keep faces upright while orbit rotates */
.orbitPic{
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow: 0 18px 50px rgba(0,0,0,0.55);
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(8px);

  /* cancel parent rotate so face stays upright */
  animation: unspin 8s linear infinite;
  will-change: transform;
}

@keyframes unspin{
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

/* place 2 pics opposite each other */
.orbitPic:nth-child(1){
  left: 50%;
  top: 0%;
  transform: translate(-50%, -12%);
}
.orbitPic:nth-child(2){
  left: 50%;
  top: 100%;
  transform: translate(-50%, -88%);
}

/* optional: slight glow ring */
.orbit::before{
  content:"";
  position:absolute;
  inset: 8px;
  border-radius: 999px;
  border: 1px solid rgba(255,209,102,0.18);
  box-shadow: 0 0 30px rgba(255,209,102,0.10);
}

/* fireworks overlay */
.fwWrap{
  position:absolute;
  inset:0;
  pointer-events:none;
  z-index:6;
}
.burst{
  position:absolute;
  transform: translate(-50%,-50%) scale(var(--s));
  animation: burstPop 1.05s ease-out forwards;
  animation-delay: var(--d);
  filter: drop-shadow(0 0 12px rgba(255,255,255,0.18));
}
@keyframes burstPop{
  0%{ opacity:0; transform: translate(-50%,-50%) scale(0.35); }
  12%{ opacity:1; }
  100%{ opacity:0; transform: translate(-50%,-50%) scale(calc(var(--s) * 1.25)); }
}
.spark{
  position:absolute;
  left:0; top:0;
  width:4px; height:4px;
  border-radius:999px;
  background: var(--c);
  transform: rotate(var(--a)) translateX(0px);
  animation: sparkFly 1.05s ease-out forwards;
  animation-delay: var(--d);
}
@keyframes sparkFly{
  0%{ transform: rotate(var(--a)) translateX(0px) scale(0.8); opacity:1; }
  100%{ transform: rotate(var(--a)) translateX(64px) scale(0.2); opacity:0; }
}

/* Optional: if you have .scoreBadge in CSS, it stays. If not, this provides one */
.scoreBadge{
  position:absolute;
  right:12px;
  top:12px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(10px);
  font-weight: 1000;
  letter-spacing: 0.08em;
}

/* (optional) disco layer if you referenced it */
.discoLayer{
  position:absolute;
  inset:-40px;
  background: radial-gradient(circle at 30% 20%, rgba(255,77,109,0.22), transparent 55%),
              radial-gradient(circle at 70% 30%, rgba(94,234,212,0.18), transparent 55%),
              radial-gradient(circle at 50% 0%, rgba(255,209,102,0.20), transparent 60%);
  filter: blur(10px);
  opacity: 0.9;
  animation: spin 6s linear infinite;
  pointer-events:none;
}
`;