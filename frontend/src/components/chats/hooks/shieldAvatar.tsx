export const ShieldAvatar = () => (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 3 L40 10 L40 24 C40 34 22 42 22 42 C22 42 4 34 4 24 L4 10 Z" fill="url(#shieldGrad)" stroke="rgba(251,191,36,0.7)" strokeWidth="1.2" />
        <path d="M22 7 L36 13 L36 24 C36 31.5 22 38 22 38 C22 38 8 31.5 8 24 L8 13 Z" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />
        <line x1="22" y1="8" x2="22" y2="38" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8" />
        <line x1="8" y1="20" x2="36" y2="20" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8" />
        <text x="22" y="25" textAnchor="middle" fill="rgba(251,191,36,0.85)" fontSize="11" fontFamily="Cinzel,serif" fontWeight="900">A</text>
        <circle cx="15" cy="14" r="1.5" fill="rgba(251,191,36,0.35)" />
        <circle cx="29" cy="14" r="1.5" fill="rgba(251,191,36,0.35)" />
        <defs>
            <linearGradient id="shieldGrad" x1="22" y1="3" x2="22" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2a1a06" /><stop offset="100%" stopColor="#0f0a04" />
            </linearGradient>
        </defs>
    </svg>
);