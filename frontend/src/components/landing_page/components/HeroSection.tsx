import cssStylesHero from "../styles/cssStylesHero";
interface HeroSectionProps {
  visible: boolean;
}
export default function HeroSection({ visible }: HeroSectionProps) {
  return (
    <>
      <style>{cssStylesHero}</style>
      <section
        className="relative w-full flex flex-col items-center justify-center text-center min-h-screen bg-[url('/public/img/hero-bg.png')] bg-cover bg-center"
      >
        {/* Overlay oscuro */}
        <div
          className="absolute inset-0 hero-content"
        ></div>

        <div className="relative z-10 px-4 py-16 w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <h1
            className={`text-9xl md:text-[10rem] lg:text-[12rem] font-black text-amber-100 mb-10 tracking-wider section-title-glow ${visible ? 'hero-fade-in' : 'opacity-0'}`}
          >
            SpellNet
          </h1>

          {/* SEPARADOR DECORATIVO */}
          <div className={`magic-separator mb-10 w-full max-w-3xl ${visible ? 'hero-fade-in-2' : 'opacity-0'}`}>
            <div className="separator-line"></div>
            <div className="separator-ornament">
              <div className="ornament-circle"></div>
              <div className="ornament-inner"></div>
              <div className="ornament-center"></div>
              <div className="ornament-sparkle sparkle-1"></div>
              <div className="ornament-sparkle sparkle-2"></div>
              <div className="ornament-sparkle sparkle-3"></div>
              <div className="ornament-sparkle sparkle-4"></div>
            </div>
            <div className="separator-line"></div>
          </div>

          <p
            className={`text-amber-300 max-w-2xl mx-auto w-full ${visible ? 'hero-fade-in-2' : 'opacity-0'}`}
          >
            <span className="block text-2xl font-bold mb-4 leading-tight">Tu IA. Tus datos. Tu poder.</span>
            <span className="block text-lg leading-relaxed">Convierte el conocimiento en magia.</span>
          </p>
          <div className={`mt-10 ${visible ? 'hero-fade-in-3' : 'opacity-0'}`}>
            <a
              href="#planes"
              className="inline-block px-8 py-3 bg-amber-900/70 text-amber-100 border-2 border-amber-600 rounded-lg text-lg font-bold hover:bg-amber-800/90 hover:border-amber-400 transition-all duration-300"
            >
              Elige tu Clase
            </a>
          </div>
        </div>
      </section>
    </>
  )
}