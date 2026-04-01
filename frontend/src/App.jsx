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
  idle: "/memes/haroldwaiting.jpeg",
  bad: "/memes/haroldbad.jpeg",
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

function tierFromMos(mos) {
  if (mos >= 4.0) return "legend";
  if (mos >= 3.3) return "good";
  if (mos >= 2.5) return "mid";
  return "cooked";
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
   STACKED NEON TITLE
   ======================= */
function StackedTitle() {
  return <div className="stackTitle">DAP GOT TALENT</div>;
}

/* =======================
   SCROLLING TICKER
   ======================= */
function Ticker({ items = [], color = "#ff006e" }) {
  const text = items.join("  \u2726  ");
  return (
    <div className="ticker" style={{ background: color }}>
      <div className="tickerTrack">
        <span className="tickerContent">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span className="tickerContent" aria-hidden="true">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
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
      x: 12 + rnd() * 76,
      y: 18 + rnd() * 52,
      c: colors[Math.floor(rnd() * colors.length)],
      d: 0.05 + rnd() * 0.25,
      s: 0.85 + rnd() * 0.55,
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
   FULLSCREEN FIREWORKS
   ======================= */
function FullscreenFireworks({ k = 0 }) {
  const bursts = useMemo(() => {
    const rnd = () => Math.random();
    const colors = ["#ff4d6d", "#ffd166", "#8cff98", "#5eead4", "#7c3aed", "#ff9f43", "#ffffff", "#a29bfe"];
    return Array.from({ length: 22 }).map((_, i) => ({
      x: 5 + rnd() * 90,
      y: 5 + rnd() * 75,
      c: colors[Math.floor(rnd() * colors.length)],
      d: i * 0.055 + rnd() * 0.12,
      s: 1.1 + rnd() * 1.2,
      spokes: 8 + Math.floor(rnd() * 8),
    }));
  }, [k]);

  return (
    <div className="fwFullscreen" aria-hidden="true">
      {bursts.map((b, i) => (
        <div
          key={i}
          className="burstFull"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            "--c": b.c,
            "--d": `${b.d}s`,
            "--s": b.s,
          }}
        >
          {Array.from({ length: b.spokes }).map((_, j) => (
            <i key={j} className="sparkFull" style={{ "--a": `${(j * 360) / b.spokes}deg` }} />
          ))}
          {Array.from({ length: b.spokes }).map((_, j) => (
            <i
              key={`r${j}`}
              className="sparkFull sparkSmall"
              style={{ "--a": `${(j * 360) / b.spokes + 180 / b.spokes}deg` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* =======================
   BIG SCORE REVEAL
   ======================= */
const FRIEND_POSITIONS = [
  { top: "5%",    left:  "3%"  },
  { top: "4%",    right: "3%"  },
  { bottom: "6%", left:  "3%"  },
  { bottom: "5%", right: "3%"  },
];

function ScoreReveal({ score, onReset }) {
  const label =
    score >= 5 ? "CERTIFIED BANGER \uD83D\uDD25"
    : score >= 4 ? "ACTUALLY FIRE \uD83C\uDFA4"
    : score >= 3 ? "NOT BAD SIA \uD83D\uDC4F"
    : score >= 2 ? "CAN IMPROVE LA \uD83D\uDE2C"
    : "BRUH \uD83D\uDC80";

  return (
    <div className="srOverlay" aria-live="assertive">
      <div className="srBurst" />

      {FRIENDS.map((f, i) => (
        <img
          key={f.alt}
          src={f.src}
          alt={f.alt}
          draggable="false"
          className="srFriend"
          style={{
            position: "absolute",
            ...FRIEND_POSITIONS[i],
            "--fd": `${i * 0.08}s`,
            "--jd": `${i * 0.22}s`,
          }}
        />
      ))}

      <div className="srWrap">
        <div className="srScore">
          {score}<span className="srOf">/5</span>
        </div>
        <div className="srLabel">{label}</div>
        <button className="srResetBtn" onClick={onReset}>
          \uD83C\uDFA4 TRY AGAIN
        </button>
      </div>
    </div>
  );
}

/* =======================
   RAVE LIGHTS
   ======================= */
function RaveLights() {
  return (
    <div className="raveWrap" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className={`raveBeam raveBeam${i}`} />
      ))}
      <div className="raveFlash" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`ravePulse ravePulse${i}`} />
      ))}
      <div className="raveLaserGrid" />
    </div>
  );
}

export default function App() {
  const fileRef = useRef(null);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const stopTimerRef = useRef(null);

  const activeAudioRef = useRef([]);
  const tallyMosRef = useRef(0);
  const tallyScoreRef = useRef(0);

  const [mos, setMos] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [msg, setMsg] = useState("drop your clip. we judge.");
  const [err, setErr] = useState("");

  const [dispMos, setDispMos] = useState(null);
  const [dispScore, setDispScore] = useState(null);

  const [boom, setBoom] = useState(false);
  const [boomKey, setBoomKey] = useState(0);

  const [raving, setRaving] = useState(false);
  const [revealVisible, setRevealVisible] = useState(false);

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
    if (tier === "legend") return { who: "CAT JUDGE \uD83D\uDE3C\u2728", vibe: "VOCALS ARE ILLEGAL" };
    if (tier === "good") return { who: "UNCLE JUDGE \uD83D\uDD7A", vibe: "okayy not bad ah" };
    if (tier === "mid") return { who: "NPC JUDGE \uD83D\uDE10", vibe: "passable. can." };
    if (tier === "cooked") return { who: "AUNTIE JUDGE \uD83D\uDC80", vibe: "pls practice hor" };
    return { who: "DAP GOT TALENT \uD83C\uDFA4", vibe: "drop your clip. we judge." };
  }, [tier]);

  useEffect(() => {
    if (mos == null && score == null) {
      setDispMos(null);
      setDispScore(null);
      return;
    }

    const endMos = mos;
    const endScore = score;

    activeAudioRef.current.forEach((a) => { try { a.pause(); a.currentTime = 0; } catch (_) {} });
    activeAudioRef.current = [];

    setBoom(false);
    setRaving(false);
    setRevealVisible(false);

    const wheel = new Audio("/audio/spin-the-wheel-edm.mp3");
    wheel.volume = 0.75;
    activeAudioRef.current.push(wheel);
    wheel.play().catch(() => {});

    let raf = 0;
    const t0 = performance.now();
    let lastFlip = 0;

    const tick = (t) => {
      if (t - lastFlip > 100) {
        lastFlip = t;
        const elapsed = (t - t0) / 1000;
        const cycle = (elapsed * 1.4) % 2;
        const wave = cycle < 1 ? cycle : 2 - cycle;
        const fakeMos = clamp(
          parseFloat((1 + wave * 4 + (Math.random() - 0.5) * 0.5).toFixed(2)),
          1.0, 5.0
        );
        const fakeScore = clamp(Math.round(1 + wave * 4 + (Math.random() - 0.5) * 0.8), 1, 5);
        setDispMos(fakeMos);
        tallyMosRef.current = fakeMos;
        setDispScore(fakeScore);
        tallyScoreRef.current = fakeScore;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    let revealed = false;
    const onReveal = () => {
      if (revealed) return;
      revealed = true;
      wheel.pause();
      cancelAnimationFrame(raf);

      const fromMos = tallyMosRef.current;
      const fromScore = tallyScoreRef.current;
      const snapDur = 600;
      const snapT0 = performance.now();

      const snap = (t) => {
        const p = clamp((t - snapT0) / snapDur, 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setDispMos(fromMos + (endMos - fromMos) * e);
        setDispScore(Math.round(fromScore + (endScore - fromScore) * e));
        if (p < 1) {
          requestAnimationFrame(snap);
        } else {
          setDispMos(endMos);
          setDispScore(endScore);

          setBoomKey((x) => x + 1);
          setBoom(true);
          window.setTimeout(() => setBoom(false), 2200);

          if (endMos >= 2.1) setRaving(true);

          setRevealVisible(true);

          const clip = endMos < 2.1
            ? "/audio/aw-hell-nah-man.mp3"
            : "/audio/u-got-that-mp3-fix.mp3";
          const sfx = new Audio(clip);
          sfx.volume = 0.85;
          activeAudioRef.current.push(sfx);
          sfx.play().catch(() => {});
        }
      };
      requestAnimationFrame(snap);
    };

    const onTimeUpdate = () => {
      if (wheel.duration && wheel.currentTime >= wheel.duration / 2) {
        onReveal();
      }
    };

    wheel.addEventListener("timeupdate", onTimeUpdate);
    wheel.addEventListener("ended", onReveal);

    return () => {
      cancelAnimationFrame(raf);
      wheel.removeEventListener("timeupdate", onTimeUpdate);
      wheel.removeEventListener("ended", onReveal);
      wheel.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mos, score]);

  async function scoreFile(file) {
    if (!file) return;
    setErr("");
    setLoading(true);
    setMsg("JUDGING\u2026");

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
    setMsg("requesting mic\u2026");

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
        setMsg("uploading\u2026");
        await scoreFile(file);
      };

      mr.start();
      setRecording(true);
      setMsg(`recording\u2026 (${seconds}s)`);

      stopTimerRef.current = window.setTimeout(() => {
        if (mr.state === "recording") mr.stop();
      }, seconds * 1000);
    } catch (e) {
      setErr(e.message || String(e));
      setMsg("mic blocked \uD83D\uDE2D allow mic in browser");
    }
  }

  function stopRecordingNow() {
    const mr = recorderRef.current;
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (mr && mr.state === "recording") mr.stop();
  }

  function resetAll() {
    activeAudioRef.current.forEach((a) => { try { a.pause(); a.currentTime = 0; } catch (_) {} });
    activeAudioRef.current = [];
    const mr = recorderRef.current;
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (mr && mr.state === "recording") mr.stop();
    setMos(null);
    setScore(null);
    setDispMos(null);
    setDispScore(null);
    setLoading(false);
    setRecording(false);
    setMsg("drop your clip. we judge.");
    setErr("");
    setBoom(false);
    setRaving(false);
    setRevealVisible(false);
  }

  const pct = mos == null ? 0 : clamp((mos - 1) / 4, 0, 1) * 100;

  return (
    <div style={styles.page(tier)}>
      <style>{css}</style>

      {raving && <RaveLights />}
      {revealVisible && <ScoreReveal score={dispScore} onReset={resetAll} />}
      {boom && <FullscreenFireworks k={boomKey} />}

      {/* TOP TICKER */}
      <Ticker
        color="#ff006e"
        items={["DAP GOT TALENT", "LIVE NOW", "LOCAL AI JUDGE", "MOS 1-5", "CERTIFIED BANGER OR COOKED", "UPLOAD OR RECORD", "WE JUDGE INSTANTLY"]}
      />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.liveTag}>🔴 LIVE</div>
        <StackedTitle />
        <div style={styles.tagline}>upload or record  ·  we judge instantly  ·  hahaha</div>
      </header>

      {/* MAIN */}
      <main style={styles.main}>
        <div style={styles.grid}>

          {/* LEFT: judge */}
          <section style={styles.panelLeft}>
            <div style={styles.panelLabel}>THE JUDGE</div>
            <div style={styles.judgeFrame}>
              {(recording || loading) && <div className="discoLayer" />}
              <img
                key={reactionTier}
                src={judgeImg}
                alt="judge reaction"
                draggable="false"
                style={styles.judgeImg}
              />
              <img
                key={"cat-" + reactionTier}
                src={npcImg}
                alt="npc"
                draggable="false"
                style={styles.catStickerSmall}
              />
              {dispScore != null && <div style={styles.scoreBadgePink}>{dispScore}/5</div>}
            </div>
            <div style={styles.speechBubble}>
              <div style={styles.speechNub} />
              <div style={styles.speechWho}>{face.who}</div>
              <div style={styles.speechVibe}>{face.vibe}</div>
            </div>
            <div style={styles.audienceRow}>
              {FRIENDS.map((f) => (
                <img key={f.alt} src={f.src} alt={f.alt} draggable="false" style={styles.audiencePic} />
              ))}
            </div>
          </section>

          {/* CENTER: stage */}
          <section style={styles.panelCenter}>
            <div style={styles.panelLabel}>THE STAGE</div>
            <input ref={fileRef} type="file" accept="audio/*" onChange={onChange} style={{ display: "none" }} />

            {!recording ? (
              <button
                onClick={() => startRecording(7)}
                disabled={loading}
                style={styles.circMicBtn(loading, tier)}
                title="Record 7 seconds then score automatically"
              >
                <div className="micRing" />
                <div className="micRing2" />
                <GoldMicIcon size={90} />
                <div style={styles.micLabel}>{loading ? "JUDGING..." : "TAP TO SING"}</div>
              </button>
            ) : (
              <button
                onClick={stopRecordingNow}
                style={styles.circMicBtn(false, "cooked")}
                title="Stop recording now"
              >
                <div className="micRing" />
                <div className="micRing2" />
                <GoldMicIcon size={90} />
                <div style={styles.micLabel}>RECORDING...</div>
              </button>
            )}

            <div style={styles.uploadRow}>
              <button
                onClick={onPick}
                disabled={loading || recording}
                style={styles.uploadBtn}
              >
                📁 UPLOAD FILE
              </button>
              <div style={styles.statusPill}>
                <div style={styles.statusDot(recording, loading)} />
                <span style={styles.statusText}>{recording ? "recording" : loading ? "scoring" : "ready"}</span>
              </div>
            </div>

            <div style={styles.helperText}>5-10 sec · sing loud · no whispering</div>
          </section>

          {/* RIGHT: scoreboard */}
          <section style={styles.panelRight}>
            <div style={styles.panelLabel}>SCOREBOARD</div>
            <div style={styles.scoreCard}>
              {boom && <Fireworks k={boomKey} />}
              <div style={styles.scoreRow}>
                <div style={styles.scoreBlock}>
                  <div style={styles.scoreLabel}>MOS</div>
                  <div style={styles.scoreValue}>{dispMos == null ? "--" : Number(dispMos).toFixed(2)}</div>
                </div>
                <div style={styles.scoreDivider} />
                <div style={styles.scoreBlock}>
                  <div style={styles.scoreLabel}>OUT OF 5</div>
                  <div style={styles.scoreValue}>{dispScore == null ? "--" : dispScore}</div>
                </div>
              </div>
              <div style={styles.meter}>
                <div style={styles.meterFill(pct)} />
              </div>
              <div style={styles.hintText}>{msg}</div>
              {err && <div style={styles.errBox}>⚠ {err}</div>}
            </div>
            <div style={styles.poweredBy}>Powered by SingMOS · z → MOS</div>
          </section>

        </div>
      </main>

      {/* BOTTOM TICKER */}
      <Ticker
        color="#007a8a"
        items={["tap to sing", "7 seconds to glory", "MOS = mean opinion score", "our AI judge has no mercy", "no cap fr fr", "drop ur clip bestie", "sing ur heart out"]}
      />
    </div>
  );
}

/* =======================
   STYLES
   ======================= */
const styles = {
  page: (tier) => {
    const dotColor = tier === "cooked"
      ? "rgba(255,0,80,0.05)"
      : tier === "legend"
      ? "rgba(0,245,255,0.05)"
      : "rgba(255,255,255,0.032)";
    return {
      minHeight: "100vh",
      background: "#08080c",
      backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
      backgroundSize: "28px 28px",
      color: "#fff",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    };
  },

  header: {
    padding: "24px 20px 14px",
    textAlign: "center",
  },
  liveTag: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.18em",
    padding: "5px 12px",
    borderRadius: 999,
    background: "rgba(255,0,110,0.16)",
    border: "1px solid rgba(255,0,110,0.40)",
    color: "#ff006e",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  tagline: {
    marginTop: 10,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    letterSpacing: "0.06em",
  },

  main: {
    flex: 1,
    padding: "0 16px 20px",
    maxWidth: 1400,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 320px) 1fr minmax(280px, 360px)",
    gap: 16,
    alignItems: "start",
  },

  panelLeft: {
    background: "rgba(255,255,255,0.03)",
    border: "2px solid #ff006e",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 0 32px rgba(255,0,110,0.18), inset 0 0 24px rgba(255,0,110,0.04)",
    transform: "rotate(-1.5deg)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    backdropFilter: "blur(12px)",
  },

  panelCenter: {
    background: "rgba(255,255,255,0.03)",
    border: "2px solid #ffe600",
    borderRadius: 20,
    padding: "24px 20px",
    boxShadow: "0 0 32px rgba(255,230,0,0.18), inset 0 0 24px rgba(255,230,0,0.04)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    backdropFilter: "blur(12px)",
  },

  panelRight: {
    background: "rgba(255,255,255,0.03)",
    border: "2px solid #00f5ff",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 0 32px rgba(0,245,255,0.18), inset 0 0 24px rgba(0,245,255,0.04)",
    transform: "rotate(1.5deg)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    backdropFilter: "blur(12px)",
  },

  panelLabel: {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.20em",
    color: "rgba(255,255,255,0.55)",
    textTransform: "uppercase",
  },

  judgeFrame: {
    position: "relative",
    height: 270,
    borderRadius: 14,
    overflow: "hidden",
    background: "#111",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  judgeImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  catStickerSmall: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 90,
    height: 90,
    objectFit: "cover",
    borderRadius: 10,
    border: "2px solid rgba(255,255,255,0.18)",
    background: "#000",
    boxShadow: "0 8px 24px rgba(0,0,0,0.60)",
  },
  scoreBadgePink: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: "5px 12px",
    borderRadius: 999,
    background: "#ff006e",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    letterSpacing: "0.08em",
    boxShadow: "0 0 18px rgba(255,0,110,0.70)",
  },

  speechBubble: {
    position: "relative",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: "12px 14px",
    backdropFilter: "blur(8px)",
  },
  speechNub: {
    position: "absolute",
    top: -9,
    left: 20,
    width: 0,
    height: 0,
    borderLeft: "9px solid transparent",
    borderRight: "9px solid transparent",
    borderBottom: "9px solid rgba(255,255,255,0.12)",
  },
  speechWho: {
    fontWeight: 900,
    fontSize: 13,
    letterSpacing: "0.06em",
    color: "#ffe600",
  },
  speechVibe: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.68)",
  },

  audienceRow: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  audiencePic: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.18)",
    background: "#111",
  },

  circMicBtn: (disabled, tier) => {
    const isHot = tier === "cooked";
    const isCool = tier === "legend" || tier === "good";
    const color = isHot ? "#ff4d6d" : isCool ? "#00f5ff" : "#ffe600";
    return {
      width: 210,
      height: 210,
      borderRadius: "50%",
      border: `3px solid ${color}`,
      background: "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.10), rgba(0,0,0,0.75))",
      boxShadow: `0 0 40px ${color}55, 0 0 80px ${color}22, inset 0 0 30px rgba(0,0,0,0.60)`,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.75 : 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      position: "relative",
      color: "#fff",
      overflow: "visible",
      flexShrink: 0,
      fontFamily: "inherit",
    };
  },
  micLabel: {
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#fff",
    textShadow: "0 2px 10px rgba(0,0,0,0.80)",
    position: "relative",
  },

  uploadRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  uploadBtn: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: "0.08em",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.30)",
    backdropFilter: "blur(8px)",
  },
  statusDot: (recording, loading) => ({
    width: 9,
    height: 9,
    borderRadius: "50%",
    flexShrink: 0,
    background: recording ? "#ff006e" : loading ? "#ffe600" : "#39ff14",
    boxShadow: recording
      ? "0 0 10px #ff006e"
      : loading
      ? "0 0 10px #ffe600"
      : "0 0 10px #39ff14",
  }),
  statusText: {
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: "0.10em",
    color: "rgba(255,255,255,0.80)",
    textTransform: "uppercase",
  },
  helperText: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 12,
    letterSpacing: "0.05em",
    textAlign: "center",
  },

  scoreCard: {
    position: "relative",
    background: "rgba(0,0,0,0.45)",
    border: "1px solid rgba(0,245,255,0.18)",
    borderRadius: 16,
    padding: 18,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  scoreBlock: {
    flex: 1,
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.16em",
    color: "rgba(255,255,255,0.55)",
    textTransform: "uppercase",
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: "#00f5ff",
    textShadow: "0 0 28px rgba(0,245,255,0.60)",
    marginTop: 2,
  },
  scoreDivider: {
    width: 1,
    height: 58,
    background: "rgba(255,255,255,0.12)",
    flexShrink: 0,
    margin: "0 6px",
  },
  meter: {
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.08)",
    overflow: "hidden",
    margin: "14px 0 8px",
  },
  meterFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #ff006e, #ffe600, #39ff14, #00f5ff)",
    transition: "width 0.12s",
  }),
  hintText: {
    color: "rgba(255,255,255,0.60)",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  errBox: {
    marginTop: 10,
    color: "#ffb3b3",
    background: "rgba(255,77,109,0.14)",
    border: "1px solid rgba(255,77,109,0.28)",
    borderRadius: 12,
    padding: "9px 12px",
    fontSize: 13,
  },
  poweredBy: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 11,
    letterSpacing: "0.05em",
    textAlign: "center",
  },
};

/* =======================
   CSS KEYFRAMES
   ======================= */
const css = `
/* Stacked neon title */
.stackTitle {
  font-size: clamp(32px, 5.5vw, 88px);
  font-weight: 1000;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  text-shadow:
    4px 4px 0 #ffe600,
    8px 8px 0 #ff006e,
    12px 12px 0 rgba(255,0,110,0.28);
  animation: stackBreath 3.5s ease-in-out infinite;
  display: block;
  line-height: 1.05;
  padding-bottom: 16px;
}
@keyframes stackBreath {
  0%, 100% { filter: brightness(1); }
  50%       { filter: brightness(1.12) drop-shadow(0 0 28px rgba(255,255,255,0.22)); }
}

/* Scrolling ticker */
.ticker {
  width: 100%;
  overflow: hidden;
  padding: 9px 0;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}
.tickerTrack {
  display: inline-flex;
  animation: tickerScroll 32s linear infinite;
  will-change: transform;
}
.tickerContent {
  display: inline-block;
  padding-right: 48px;
}
@keyframes tickerScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Circular mic pulse rings */
.micRing {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(255,230,0,0.55);
  animation: micPulse 2s ease-out infinite;
  pointer-events: none;
}
.micRing2 {
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 1px solid rgba(255,230,0,0.28);
  animation: micPulse 2s ease-out 0.7s infinite;
  pointer-events: none;
}
@keyframes micPulse {
  0%   { opacity: 0.85; transform: scale(1);    }
  100% { opacity: 0;    transform: scale(1.30); }
}

/* Disco layer (recording/loading glow) */
.discoLayer {
  position: absolute;
  inset: -40px;
  background:
    radial-gradient(circle at 30% 20%, rgba(255,77,109,0.22), transparent 55%),
    radial-gradient(circle at 70% 80%, rgba(94,234,212,0.18), transparent 55%),
    radial-gradient(circle at 50% 50%, rgba(255,209,102,0.15), transparent 55%);
  filter: blur(14px) saturate(1.5);
  animation: discoMove 0.9s linear infinite, discoHue 1.2s linear infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes discoMove {
  0%   { transform: translate(-6%, -4%) rotate(0deg);   }
  50%  { transform: translate(6%,  4%) rotate(180deg);  }
  100% { transform: translate(-6%, -4%) rotate(360deg); }
}
@keyframes discoHue {
  0%   { filter: blur(14px) saturate(1.6) hue-rotate(0deg);   }
  100% { filter: blur(14px) saturate(1.6) hue-rotate(360deg); }
}

/* card-level fireworks */
.fwWrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
}
.burst {
  position: absolute;
  transform: translate(-50%,-50%) scale(var(--s));
  animation: burstPop 1.05s ease-out forwards;
  animation-delay: var(--d);
  filter: drop-shadow(0 0 12px rgba(255,255,255,0.18));
}
@keyframes burstPop {
  0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.35); }
  12%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(calc(var(--s) * 1.25)); }
}
.spark {
  position: absolute;
  left: 0; top: 0;
  width: 4px; height: 4px;
  border-radius: 999px;
  background: var(--c);
  transform: rotate(var(--a)) translateX(0px);
  animation: sparkFly 1.05s ease-out forwards;
  animation-delay: var(--d);
}
@keyframes sparkFly {
  0%   { transform: rotate(var(--a)) translateX(0px)  scale(0.8); opacity: 1; }
  100% { transform: rotate(var(--a)) translateX(64px) scale(0.2); opacity: 0; }
}

/* fullscreen fireworks */
.fwFullscreen {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
.burstFull {
  position: absolute;
  transform: translate(-50%,-50%);
  animation: burstPopFull 1.4s ease-out forwards;
  animation-delay: var(--d);
  filter: drop-shadow(0 0 18px var(--c));
  opacity: 0;
}
@keyframes burstPopFull {
  0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.2); }
  8%   { opacity: 1; }
  85%  { opacity: 0.85; }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(calc(var(--s) * 1.4)); }
}
.sparkFull {
  position: absolute;
  left: 0; top: 0;
  width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--c);
  box-shadow: 0 0 8px var(--c), 0 0 3px #fff;
  transform: rotate(var(--a)) translateX(0px);
  animation: sparkFlyFull 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--d);
}
.sparkSmall { width: 3px; height: 3px; }
@keyframes sparkFlyFull {
  0%   { transform: rotate(var(--a)) translateX(0px)   scale(1.4); opacity: 1; }
  60%  { opacity: 0.9; }
  100% { transform: rotate(var(--a)) translateX(160px) scale(0.1); opacity: 0; }
}

/* ===== RAVE LIGHTS ===== */
.raveWrap {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;
  overflow: hidden;
  mix-blend-mode: screen;
}
.raveBeam {
  position: absolute;
  top: -5px;
  left: 50%;
  margin-left: -280px;
  width: 560px;
  height: 115vh;
  transform-origin: 50% 0%;
  clip-path: polygon(48% 0%, 52% 0%, 100% 100%, 0% 100%);
}
.raveBeam1 { background: linear-gradient(180deg,rgba(255,77,109,0.65) 0%,transparent 82%);  animation: rSweep1 1.10s ease-in-out infinite alternate; }
.raveBeam2 { background: linear-gradient(180deg,rgba(94,234,212,0.60) 0%,transparent 82%);  animation: rSweep2 0.80s ease-in-out infinite alternate; }
.raveBeam3 { background: linear-gradient(180deg,rgba(255,209,102,0.58) 0%,transparent 82%); animation: rSweep3 1.40s ease-in-out infinite alternate; }
.raveBeam4 { background: linear-gradient(180deg,rgba(124,58,237,0.65) 0%,transparent 82%);  animation: rSweep4 0.65s ease-in-out infinite alternate; }
.raveBeam5 { background: linear-gradient(180deg,rgba(140,255,152,0.55) 0%,transparent 82%); animation: rSweep5 1.20s ease-in-out infinite alternate; }
.raveBeam6 { background: linear-gradient(180deg,rgba(96,165,250,0.60) 0%,transparent 82%);  animation: rSweep6 0.90s ease-in-out infinite alternate; }
.raveBeam7 { background: linear-gradient(180deg,rgba(255,255,255,0.35) 0%,transparent 70%); animation: rSweep7 0.50s ease-in-out infinite alternate; }
.raveBeam8 { background: linear-gradient(180deg,rgba(255,153,51,0.55) 0%,transparent 82%);  animation: rSweep8 1.55s ease-in-out infinite alternate; }
@keyframes rSweep1 { from{transform:rotate(-52deg)} to{transform:rotate(42deg)} }
@keyframes rSweep2 { from{transform:rotate(-68deg)} to{transform:rotate(18deg)} }
@keyframes rSweep3 { from{transform:rotate(8deg)}   to{transform:rotate(68deg)} }
@keyframes rSweep4 { from{transform:rotate(-78deg)} to{transform:rotate(-8deg)} }
@keyframes rSweep5 { from{transform:rotate(-38deg)} to{transform:rotate(58deg)} }
@keyframes rSweep6 { from{transform:rotate(-22deg)} to{transform:rotate(72deg)} }
@keyframes rSweep7 { from{transform:rotate(-62deg)} to{transform:rotate(62deg)} }
@keyframes rSweep8 { from{transform:rotate(20deg)}  to{transform:rotate(80deg)} }
.raveFlash {
  position: absolute;
  inset: 0;
  animation: rFlicker 0.22s steps(1) infinite;
}
@keyframes rFlicker {
  0%   { background: rgba(255,77,109,0.08);  }
  14%  { background: rgba(94,234,212,0.09);  }
  28%  { background: rgba(255,209,102,0.08); }
  42%  { background: rgba(124,58,237,0.09);  }
  57%  { background: rgba(140,255,152,0.08); }
  71%  { background: rgba(96,165,250,0.09);  }
  85%  { background: rgba(255,255,255,0.05); }
  100% { background: rgba(255,77,109,0.08);  }
}
.ravePulse {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.ravePulse1 { width:700px;height:700px; top:-220px;   left:-180px;  background:rgba(255,77,109,0.22);  animation:rPulse 0.58s ease-in-out infinite alternate; }
.ravePulse2 { width:700px;height:700px; top:-220px;   right:-180px; background:rgba(94,234,212,0.20);  animation:rPulse 0.73s ease-in-out infinite alternate; animation-delay:-0.28s; }
.ravePulse3 { width:550px;height:550px; bottom:-140px;left:-120px;  background:rgba(124,58,237,0.20); animation:rPulse 0.48s ease-in-out infinite alternate; animation-delay:-0.14s; }
.ravePulse4 { width:550px;height:550px; bottom:-140px;right:-120px; background:rgba(255,209,102,0.18);animation:rPulse 0.62s ease-in-out infinite alternate; animation-delay:-0.42s; }
@keyframes rPulse {
  from { opacity: 0.30; transform: scale(0.86); }
  to   { opacity: 1.00; transform: scale(1.14); }
}
.raveLaserGrid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(94,234,212,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94,234,212,0.07) 1px, transparent 1px);
  background-size: 65px 65px;
  animation: rGrid 0.38s ease-in-out infinite alternate;
}
@keyframes rGrid {
  from { opacity: 0.20; }
  to   { opacity: 0.85; }
}

/* ===== BIG SCORE REVEAL ===== */
.srOverlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 8000;
}
.srBurst {
  position: absolute;
  inset: 0;
  animation: srBurstAnim 3.5s ease-out forwards;
}
@keyframes srBurstAnim {
  0%   { background: radial-gradient(0px   at 50% 50%, rgba(255,77,109,0.00),  transparent 70%); }
  12%  { background: radial-gradient(600px at 50% 50%, rgba(255,77,109,0.45),  transparent 70%); }
  28%  { background: radial-gradient(700px at 50% 50%, rgba(255,209,102,0.38), transparent 70%); }
  45%  { background: radial-gradient(650px at 50% 50%, rgba(94,234,212,0.32),  transparent 70%); }
  62%  { background: radial-gradient(600px at 50% 50%, rgba(124,58,237,0.28),  transparent 70%); }
  80%  { background: radial-gradient(500px at 50% 50%, rgba(140,255,152,0.20), transparent 70%); }
  100% { background: radial-gradient(300px at 50% 50%, rgba(255,77,109,0.00),  transparent 70%); }
}
.srWrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: srGrow 0.70s cubic-bezier(0.34,1.56,0.64,1) forwards;
}
@keyframes srGrow {
  from { transform: scale(0.04); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
.srScore {
  font-size: clamp(110px, 26vw, 310px);
  font-weight: 1000;
  line-height: 1;
  letter-spacing: -0.02em;
  animation: srColorCycle 0.32s steps(1) infinite;
  filter: drop-shadow(0 0 50px currentColor) drop-shadow(0 0 100px currentColor);
}
.srOf {
  font-size: 0.32em;
  letter-spacing: 0;
  opacity: 0.85;
}
@keyframes srColorCycle {
  0%   { color: #ff4d6d; }
  16%  { color: #ffd166; }
  33%  { color: #8cff98; }
  50%  { color: #5eead4; }
  66%  { color: #7c3aed; }
  83%  { color: #60a5fa; }
  100% { color: #ff4d6d; }
}
.srLabel {
  font-size: clamp(16px, 2.8vw, 34px);
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.95);
  text-shadow: 0 0 28px rgba(255,255,255,0.55);
  animation: srLabelIn 0.4s ease-out 0.55s both;
}
@keyframes srLabelIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
}
.srResetBtn {
  margin-top: 22px;
  padding: 14px 36px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.30);
  background: rgba(0,0,0,0.45);
  color: rgba(255,255,255,0.95);
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(12px);
  font-family: inherit;
  animation: srLabelIn 0.4s ease-out 0.9s both, srResetPulse 1.8s ease-in-out 1.3s infinite;
  pointer-events: all;
}
.srResetBtn:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.60);
}
@keyframes srResetPulse {
  0%,100% { box-shadow: 0 0 0px  rgba(255,255,255,0.00); }
  50%     { box-shadow: 0 0 28px rgba(255,255,255,0.35); }
}
.srFriend {
  width: clamp(130px, 16vw, 220px);
  height: clamp(130px, 16vw, 220px);
  object-fit: cover;
  border-radius: 999px;
  border: 5px solid transparent;
  animation:
    srFriendPop     0.60s cubic-bezier(0.34,1.56,0.64,1) var(--fd) both,
    srFriendRainbow 0.40s steps(1)                        infinite  var(--fd),
    srFriendJiggle  1.80s ease-in-out                     var(--jd) infinite;
  transform-origin: center bottom;
  z-index: 1;
}
@keyframes srFriendPop {
  from { transform: scale(0.05) rotate(-10deg); opacity: 0; }
  to   { transform: scale(1)    rotate(0deg);   opacity: 1; }
}
@keyframes srFriendRainbow {
  0%   { border-color:#ff4d6d; box-shadow: 0 0 28px rgba(255,77,109,0.85),  0 0 60px rgba(255,77,109,0.40); }
  16%  { border-color:#ffd166; box-shadow: 0 0 28px rgba(255,209,102,0.85), 0 0 60px rgba(255,209,102,0.40); }
  33%  { border-color:#8cff98; box-shadow: 0 0 28px rgba(140,255,152,0.85), 0 0 60px rgba(140,255,152,0.40); }
  50%  { border-color:#5eead4; box-shadow: 0 0 28px rgba(94,234,212,0.85),  0 0 60px rgba(94,234,212,0.40); }
  66%  { border-color:#7c3aed; box-shadow: 0 0 28px rgba(124,58,237,0.85),  0 0 60px rgba(124,58,237,0.40); }
  83%  { border-color:#60a5fa; box-shadow: 0 0 28px rgba(96,165,250,0.85),  0 0 60px rgba(96,165,250,0.40); }
  100% { border-color:#ff4d6d; box-shadow: 0 0 28px rgba(255,77,109,0.85),  0 0 60px rgba(255,77,109,0.40); }
}
@keyframes srFriendJiggle {
  0%,100% { transform: rotate(-4deg) scale(1.00); }
  25%     { transform: rotate( 4deg) scale(1.05); }
  50%     { transform: rotate(-2deg) scale(0.97); }
  75%     { transform: rotate( 3deg) scale(1.03); }
}
`;
