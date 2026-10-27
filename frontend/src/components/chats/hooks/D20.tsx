export const D20 = ({ size = 22, opacity = 0.55 }: { size?: number; opacity?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity, flexShrink: 0 }}>
        <polygon points="20,2 38,13 38,27 20,38 2,27 2,13" stroke="rgba(251,191,36,0.85)" strokeWidth="1.5" fill="rgba(30,20,10,0.7)" style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.5))' }} />
        <polygon points="20,2 38,13 20,18" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" fill="rgba(251,191,36,0.05)" />
        <polygon points="2,13 20,18 20,2" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" fill="rgba(251,191,36,0.03)" />
        <polygon points="38,13 38,27 20,18" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" fill="rgba(251,191,36,0.07)" />
        <polygon points="2,13 20,18 2,27" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" fill="rgba(251,191,36,0.04)" />
        <polygon points="20,18 38,27 20,38 2,27" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" fill="rgba(251,191,36,0.06)" />
        <text x="20" y="27" textAnchor="middle" fill="rgba(251,191,36,0.9)" fontSize="10" fontFamily="Cinzel,serif" fontWeight="900">20</text>
    </svg>
);