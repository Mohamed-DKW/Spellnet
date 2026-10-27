import { useState, useEffect } from 'react';
import cssStyles from '../components/landing_page/styles/cssStyles';
import HeroSection from '../components/landing_page/components/HeroSection';
import DiceDivider from '../components/landing_page/components/DiceDivider';
import AboutSection from '../components/landing_page/components/AboutSection';
import PlansSection from '../components/landing_page/components/PlansSection';

export default function LandingPage() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    // Cambiar título de la página
    document.title = "SpellNet";
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ fontFamily: "'Cinzel', serif" }}>
      <style>{cssStyles}</style>

      {/* HERO SECTION */}
      <HeroSection visible={visible} />
      {/* DICE DIVIDER */}
      <DiceDivider />

      {/* CONOCENOS*/}
      <AboutSection />

      {/* PLANES */}
      <PlansSection />
    </div>
  );
}
