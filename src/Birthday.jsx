import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "./assets/image.png";
import img from "./assets/img2.png";
import img3 from "./assets/img3.png";
import AnimatedBirthdayCard from "./Card";
import song from "./assets/song.mp3";

// Simple UI components
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`btn ${className}`}
    aria-label={typeof children === "string" ? children : "button"}
  >
    {children}
  </button>
);
const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>{children}</div>
);
const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

// Confetti canvas
const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const random = (min, max) => Math.random() * (max - min) + min;
    const createParticle = () => ({
      x: random(0, width),
      y: random(-20, -5),
      r: random(5, 12),
      d: random(2, 5),
      tilt: random(-10, 10),
      color: `hsl(${Math.floor(random(0, 360))}, 90%, 65%)`,
      tiltAngleIncrement: random(0.05, 0.12),
      tiltAngle: 0,
    });

    const updateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      particles.current.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle) * 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
        if (p.y > height) {
          particles.current[i] = createParticle();
          particles.current[i].y = -10;
        }
      });
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const animate = () => {
      if (active) {
        if (particles.current.length < 180) {
          particles.current.push(createParticle());
        }
        updateParticles();
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="confetti-canvas"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
    />
  );
};

// Floating photo frame component
const FloatingPhoto = ({ src, style, alt, className = "" }) => (
  <div className={`photo-frame ${className}`} style={style}>
    <img src={src} alt={alt || "photo"} />
    <div className="glow" />
  </div>
);

const BirthdayPage = () => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const audioRef = useRef(null);
  const [name, setName] = useState("Hafsa Zaman");
  const [birthday, setBirthday] = useState("2025-02-08");
  const [countdown, setCountdown] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999 // Today at 11:59:59 PM
      );

      let diff = target - now;
      if (diff < 0) diff = 0;

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [birthday]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setMusicPlaying(true);
    }
  };

  const launchSurprise = () => {
    setShowMessage(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setMusicPlaying(true);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary:#ff6ec7;
          --accent:#ffe066;
          --bg1:#1f005c;
          --bg2:#8338ec;
          --transition:.35s cubic-bezier(.22,.61,.36,1);
        }
        *{box-sizing:border-box;}
        body,html{margin:0;padding:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;}
        .page {
          position:relative;
          min-height:100vh;
          overflow:hidden;
          background: radial-gradient(ellipse at bottom right, rgba(255,238,255,0.35), transparent 40%), linear-gradient(135deg,var(--bg1), var(--bg2));
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:2rem;
          flex-direction:column;
        }
        .card {
          position:relative;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:1.5rem;
          padding:2rem;
          max-width:900px;
          width:100%;
          box-shadow:0 35px 60px -15px rgba(0,0,0,0.5);
          overflow:hidden;
        }
        .card-content{position:relative;z-index:2;}
        h1{
          margin:0;
          font-size:3rem;
          line-height:1.1;
          position:relative;
          background: linear-gradient(90deg,var(--accent), #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter:drop-shadow(0 10px 25px rgba(255,255,255,0.6));
          animation: glow 3s ease-in-out infinite alternate;
          text-align:center;
        }
        @keyframes glow{
          from{filter: drop-shadow(0 0 8px rgba(255,238,102,0.8)) drop-shadow(0 0 20px rgba(255,110,199,0.6));}
          to{filter: drop-shadow(0 0 20px rgba(255,255,255,1)) drop-shadow(0 0 30px rgba(255,110,199,0.9));}
        }
        .subtitle{
          margin:0.5rem 0 1rem;
          font-size:1.1rem;
          display:flex;
          gap:6px;
          flex-wrap:wrap;
          justify-content:center;
          align-items:center;
        }
        .inputs{
        
          display:flex;
          gap:1rem;
          flex-wrap:wrap;
          justify-content:center;
          margin:1rem 0;
        }
        input{
          text-align: center;

          padding:12px 16px;
          border-radius:12px;
          border:none;
          outline:none;
          font-size:1rem;
          width:160px;
          background:rgba(255,255,255,0.1);
          color:#fff;
          transition: all .3s ease;
          box-shadow: inset 0 0 12px rgba(255,255,255,0.1);
        }
        input:focus{
          transform: scale(1.02);
          box-shadow: 0 0 18px rgba(255,238,102,0.8);
        }
        .btn{
          cursor:pointer;
          border:none;
          position:relative;
          font-weight:600;
          padding:12px 24px;
          border-radius:999px;
          background: linear-gradient(135deg,var(--primary), var(--accent));
          color:#1f004f;
          overflow:hidden;
          transition: var(--transition);
          box-shadow: 0 20px 50px -10px rgba(255,110,199,0.6);
          backdrop-filter: blur(4px);
        }
        .btn:hover{
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        .btn:active{
          transform: scale(.97);
        }
        .controls{
          position:absolute;
          top:1rem;
          right:1rem;
          display:flex;
          gap:.75rem;
          flex-wrap:wrap;
          z-index:5;
        }
        .small-note{
          font-size:.65rem;
          opacity:.8;
          margin-top:.5rem;
          text-align:center;
        }
        .surprise-box{
          border-radius:1rem;
          padding:1.25rem;
          position:relative;
          overflow:hidden;
          background: linear-gradient(135deg,#ffe066,#ff6ec7);
          box-shadow:0 25px 60px -10px rgba(255,110,199,0.5);
          margin-top:1rem;
        }
        .photo-frame{
          position:absolute;
          width:100px;
          height:100px;
          border-radius:16px;
          overflow:hidden;
          border:4px solid rgba(255,255,255,0.5);
          box-shadow:0 25px 60px -5px rgba(255,110,199,0.5);
          background:rgba(255,255,255,0.05);
          transform: translate3d(0,0,0);
          will-change: transform;
          transition: all .4s ease;
          

        }
        @media(max-width:600px){
          .photo-frame{
            position:relative !important;
            width:80px;
            height:80px;
            margin:8px auto;
            display: flex;
            {/* display:block; */}
          }
          .controls{
            top: auto;
            bottom: 12px;
            right: 50%;
            transform: translateX(50%);
            flex-wrap: wrap;
          }
        }
        .photo-frame img{
          width:100%;
          height:100%;
          object-fit:cover;
          {/* display:block; */}
        }
        .photo-frame .glow{
          pointer-events:none;
          position:absolute;
          inset:0;
          border-radius:16px;
          box-shadow: 0 0 40px 15px rgba(255,238,102,0.6);
          mix-blend-mode: screen;
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse{
          0%{transform: scale(1);}
          50%{transform: scale(1.05);}
          100%{transform: scale(1);}
        }
        .floating{
          animation: float 8s ease-in-out infinite;
        }
        @keyframes float{
          0%{transform: translateY(0px);}
          50%{transform: translateY(-10px);}
          100%{transform: translateY(0px);}
        }
        img{
          z-index:100;
        }
        .countdown{
        
          font-weight:600;
          background:rgba(255,255,255,0.1);
          padding:6px 14px;
          border-radius:999px;
          display:inline-block;
          margin-left:4px;
          position:relative;
          backdrop-filter: blur(6px);
        }
        .footer{
          position:fixed;
          bottom:12px;
          left:12px;
          font-size:.65rem;
          display:flex;
          flex-direction:column;
          gap:2px;
          z-index:4;
          color:rgba(255,255,255,0.85);
        }
        .stars{
          position:absolute;
          inset:0;
          pointer-events:none;
          overflow:hidden;
        }
        .star{
          position:absolute;
          width:4px;
          height:4px;
          background:rgba(255,255,255,0.85);
          border-radius:50%;
          filter:blur(1px);
          animation: twinkle 5s infinite ease-in-out;
        }
        @keyframes twinkle{
          0%,100%{opacity:.7; transform: scale(1);}
          50%{opacity:1; transform: scale(1.3);}
        }
      `}</style>

      <div className="page">
        {/* animated stars */}
        <div className="stars" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => {
            const size = Math.random() * 6 + 2;
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            return (
              <div
                key={i}
                className="star"
                style={{
                  width: size,
                  height: size,
                  top: `${top}%`,
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  opacity: Math.random() * 0.6 + 0.3,
                }}
              />
            );
          })}
        </div>

        <Confetti active={showMessage} />
        <audio ref={audioRef} loop src={song} preload="auto" />

        {/* floating photos */}
        {showMessage ? (
          <div style={{ display: "flex", columnGap: "15px" }}>
            <FloatingPhoto
              src={img1}
              alt="happy memory"
              style={{
                top: "10%",
                transform: "rotate(-5deg)",
              }}
              className="floating"
            />
            <FloatingPhoto
              src={img}
              alt="sister"
              style={{
                bottom: "15%",
                transform: "rotate(8deg)",
              }}
              className="floating"
            />
            <FloatingPhoto
              src={img3}
              alt="celebration"
              style={{
                top: "20%",
                transform: "rotate(-10deg)",
              }}
              className="floating"
            />
          </div>
        ) : null}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="card"
        >
          <CardContent>
            <div style={{ textAlign: "center" }}>
              {!showMessage ? (
                <>
                  <motion.h1
                    layout
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 140 }}
                  >
                    Happy Birthday, {name}! 🎉
                  </motion.h1>
                  <motion.div
                    className="subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                  >
                    Countdown to your special day:
                    <div className="countdown">{countdown}</div>
                  </motion.div>

                  {!showMessage ? (
                    <div style={{ margin: "1.5rem 0" }}>
                      <Button
                        onClick={() => {
                          toggleMusic();
                          launchSurprise();
                        }}
                        style={{ fontSize: "1rem" }}
                      >
                        Click Me and See Magic!
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : null}

              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    key="surprise"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                    className="surprise-box"
                  >
                    <h2 style={{ margin: 0, fontSize: "1.9rem" }}>
                      To my beloved Sister {name},
                    </h2>
                    <p style={{ marginTop: "0.5rem", lineHeight: 1.4 }}>
                      Wishing you a day filled with laughter, love, and magical
                      memories. You deserve the world and more. Here's to
                      another year of adventures, dreams, and joy!
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                        marginTop: "0.75rem",
                        justifyContent: "center",
                      }}
                    >
                      <p style={{ margin: "0" }}>Choose Any of them</p>
                      <Button onClick={() => setShowCard(true)}>🎁 Gift</Button>
                      <Button onClick={() => setShowCard(true)}>🍰 Cake</Button>
                      <Button onClick={() => setShowCard(true)}>❤️ Love</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </motion.div>

         
      </div>

      <AnimatePresence>
        {showCard && (
          <AnimatedBirthdayCard
            name="Hafsa"
            onClose={() => setShowCard(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BirthdayPage;
