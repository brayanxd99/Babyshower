"use client";

import React, { useState, useEffect } from "react";

// Native Instagram SVG Icon (clean, vector, brand-compliant)
function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Delicate Botanical Olive Branch SVG matching SELAH Brand
function OliveBranchIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 44C24 30 24 14 24 4" />
      <path d="M24 36C28 34 32 35 34 39C32 41 27 40 24 36Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M24 30C19 28 15 30 13 34C16 36 21 34 24 30Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M24 22C29 19 33 21 35 25C32 27 27 26 24 22Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M24 16C18 14 15 17 14 21C17 22 22 20 24 16Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M24 8C27 5 30 7 31 10C29 12 26 11 24 8Z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="21" cy="24" r="2" fill="currentColor" />
      <circle cx="27" cy="18" r="2" fill="currentColor" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Subtle Tap Indicator Icon
function TapHandIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v7" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

// --------------------------------------------------------------------------
// Animated Craft Loading Screen (Imagen 1 with movement)
// --------------------------------------------------------------------------
function CraftLoader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(onFinish, 400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#fdf6f7] via-[#fceeef] to-[#f9e4e7] p-6 text-center select-none">
      {/* Background ambient halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[500px] h-[340px] md:h-[500px] bg-[#f5d6dc] rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center">
        {/* Animated Craft Scene Card */}
        <div className="relative mb-8 p-3 md:p-4 rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl shadow-[#a75470]/15 border border-[#fae2e6] animate-gentle-float">
          {/* Crafting hands illustration */}
          <div className="relative overflow-hidden rounded-2xl max-w-[340px] md:max-w-[380px]">
            <img
              src="/craft-loading.png"
              alt="Elaborando cada pieza a mano"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Animated Threading Beads Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 flex items-center justify-center pointer-events-none">
            {/* The string */}
            <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#a75470]/40 to-transparent" />

            {/* Floating beads sliding along the thread */}
            <span className="absolute w-3.5 h-3.5 rounded-full bg-[#5295c9] shadow-sm animate-bead-1 border border-white" />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-[#d65a4a] shadow-sm animate-bead-2 border border-white" />
            <span className="absolute w-3 h-3 rounded-full bg-[#e8a360] shadow-sm animate-bead-3 border border-white" />
            <span className="absolute w-3.5 h-3.5 rounded-full bg-[#82ba69] shadow-sm animate-bead-4 border border-white" />
          </div>
        </div>

        {/* Brand Tagline */}
        <h2 className="font-editorial text-2xl md:text-3xl text-[#a75470] tracking-wide mb-1">
          SELAH
        </h2>
        <p className="font-sans-clean text-xs md:text-sm text-[#8c5a6b] tracking-wider mb-6">
          Calma en tu día, fe en tu historia.
        </p>

        {/* Progress Bar */}
        <div className="w-56 h-1.5 bg-[#f3d7de] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#c97b8f] to-[#a75470] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-sans-clean text-[11px] text-[#a75470]/80 tracking-widest uppercase">
          Preparando con amor y propósito
        </p>

        {/* Fast skip button */}
        <button
          onClick={onFinish}
          className="mt-8 text-[11px] font-sans-clean text-[#a75470]/60 hover:text-[#a75470] tracking-widest uppercase transition-colors"
        >
          Saltar
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Main Page: 3D Flip Envelope with Scripture and Instagram
// --------------------------------------------------------------------------
export default function SelahPage() {
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  // User will provide exact instagram URL later
  const instagramUrl = "https://www.instagram.com/";

  return (
    <>
      {loading && <CraftLoader onFinish={() => setLoading(false)} />}

      <main className="min-h-screen bg-gradient-to-b from-[#fdf6f7] via-[#fceeef] to-[#f9e4e7] flex flex-col justify-between items-center px-4 py-8 md:py-12 relative overflow-hidden select-none">
        {/* Ambient Soft Glow Backgrounds */}
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-[#f5d6dc] rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#f2cad2] rounded-full blur-3xl opacity-30 pointer-events-none" />

        {/* Top Minimal Brand Bar */}
        <header className="relative z-10 text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#fae2e6] shadow-sm mb-2">
            <OliveBranchIcon className="w-4 h-4 text-[#a75470]" />
            <span className="font-sans-clean text-xs tracking-widest text-[#a75470] uppercase">
              Edición Especial
            </span>
          </div>
          <p className="font-sans-clean text-xs md:text-sm text-[#8c5a6b] tracking-wider">
            Calma en tu día, fe en tu historia.
          </p>
        </header>

        {/* Central 3D Interactive Envelope Container */}
        <div className="relative z-10 w-full max-w-xl md:max-w-2xl perspective-1200 my-auto">
          {/* Card Wrapper with 3D Flip */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[460px] md:min-h-[480px] rounded-[2rem] transition-transform duration-700 ease-in-out transform-style-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* ========================================================= */}
            {/* FRONT FACE: EL SOBRE (The Violet Envelope from PDF / Img 2) */}
            {/* ========================================================= */}
            <div className="absolute inset-0 w-full h-full rounded-[2rem] backface-hidden bg-gradient-to-br from-[#b8637c] via-[#a75470] to-[#8c4058] p-6 md:p-10 flex flex-col justify-between shadow-2xl shadow-[#a75470]/30 border border-[#c47992]/50 overflow-hidden group">
              {/* Envelope Triangular Top Flap Accent */}
              <div
                className="absolute top-0 left-0 right-0 h-28 pointer-events-none opacity-40"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              />

              {/* Delicate Envelope Edge Stitch / Border */}
              <div className="absolute inset-3 rounded-[1.4rem] border border-dashed border-[#fae2e6]/30 pointer-events-none" />

              {/* Wax Seal Medallion in Top Center */}
              <div className="relative z-10 flex justify-center -mt-1 md:mt-1">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#8a3850] to-[#6d2539] border-2 border-[#eed5db] shadow-lg flex items-center justify-center animate-seal-pulse">
                  <OliveBranchIcon className="w-7 h-7 text-[#fae4e6]" />
                </div>
              </div>

              {/* Center: SELAH Logo Calligraphy from Image 2 */}
              <div className="relative z-10 my-auto text-center px-4">
                <div className="w-full max-w-[440px] mx-auto rounded-2xl overflow-hidden p-2 transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src="/selah-logo.png"
                    alt="SELAH - Calma en tu día, fe en tu historia"
                    className="w-full h-auto drop-shadow-md mx-auto"
                  />
                </div>
              </div>

              {/* Bottom Interactive Hint */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm font-sans-clean text-xs md:text-sm tracking-wide transition-all group-hover:bg-white/30">
                  <TapHandIcon className="w-4 h-4 animate-bounce" />
                  <span>Toca el sobre para abrir</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* BACK FACE: LA CARTA / REVERSO (The Scripture & Instagram)  */}
            {/* ========================================================= */}
            <div className="absolute inset-0 w-full h-full rounded-[2rem] backface-hidden rotate-y-180 bg-[#fffdfd] p-6 md:p-10 flex flex-col justify-between shadow-2xl shadow-[#a75470]/20 border-2 border-[#f3d7de] overflow-hidden">
              {/* Inner Fine Stationery Border */}
              <div className="absolute inset-3 rounded-[1.4rem] border border-[#f0cfd7] pointer-events-none" />

              {/* Corner Floral Filigree Details */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#a75470]/30 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#a75470]/30 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#a75470]/30 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#a75470]/30 rounded-br-lg pointer-events-none" />

              {/* Top Header of the Letter */}
              <div className="relative z-10 text-center pt-2">
                <div className="flex justify-center mb-1">
                  <OliveBranchIcon className="w-6 h-6 text-[#a75470]" />
                </div>
                <h3 className="font-editorial text-xl md:text-2xl text-[#a75470] tracking-wider uppercase font-semibold">
                  SELAH
                </h3>
                <p className="font-sans-clean text-[11px] text-[#8c5a6b] tracking-widest uppercase">
                  Calma en tu día, fe en tu historia.
                </p>
              </div>

              {/* Main Body: Title & Scripture Quote */}
              <div className="relative z-10 my-auto text-center px-2 md:px-6 py-2">
                <h4 className="font-editorial text-lg md:text-xl text-[#a75470] font-medium tracking-wide mb-3 md:mb-4">
                  Promesa que dió fruto a la idea de negocio:
                </h4>

                <blockquote className="font-editorial text-[#4a2632] text-sm md:text-base lg:text-[17px] leading-relaxed md:leading-relaxed text-center font-normal px-2">
                  «Y estas palabras que yo te mando hoy, estarán sobre tu corazón;
                  y las repetirás a tus hijos, y hablarás de ellas estando en tu
                  casa, y andando por el camino, y al acostarte, y cuando te
                  levantes. Y las atarás como una señal en tu mano, y estarán
                  como frontales entre tus ojos.»
                </blockquote>

                <p className="font-sans-clean text-xs text-[#9c586c] tracking-widest uppercase mt-3 font-medium">
                  Deuteronomio 6:6-8
                </p>
              </div>

              {/* Bottom Section: Instagram Button & Close Action */}
              <div className="relative z-10 flex flex-col items-center gap-3 pb-1">
                {/* Instagram Direct Link Pill */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#a75470] to-[#b8637c] text-white font-sans-clean text-xs md:text-sm font-medium tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <InstagramIcon className="w-4 h-4 text-white" />
                  <span>Conectar en Instagram</span>
                </a>

                {/* Flip Back Link */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="font-sans-clean text-[11px] text-[#a75470]/70 hover:text-[#a75470] tracking-wider uppercase underline underline-offset-4 decoration-[#e4b5c1] transition-colors"
                >
                  Cerrar sobre
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Footer */}
        <footer className="relative z-10 text-center mt-6 md:mt-10">
          <p className="font-sans-clean text-[11px] text-[#a75470]/60 tracking-widest uppercase">
            SELAH • Todos los derechos reservados
          </p>
        </footer>
      </main>
    </>
  );
}
