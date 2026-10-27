import { D20 } from './D20';
export const OrnateDivider = () => (
    <div style={{ width: '28px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 20, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(8,5,3,0) 0%, rgba(15,10,6,0.5) 50%, rgba(8,5,3,0) 100%)' }}>
        <div style={{ position: 'absolute', left: '4px', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.35) 20%, rgba(251,191,36,0.35) 80%, transparent)' }} />
        <div style={{ position: 'absolute', right: '4px', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.12) 20%, rgba(251,191,36,0.12) 80%, transparent)' }} />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '12px', height: '1px', background: 'rgba(251,191,36,0.5)' }} />
            <div style={{ width: '6px', height: '6px', background: 'rgba(251,191,36,0.6)', transform: 'rotate(45deg)', boxShadow: '0 0 6px rgba(251,191,36,0.5)' }} />
            <div style={{ width: '12px', height: '1px', background: 'rgba(251,191,36,0.5)' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '16px 0' }}>
            {[...Array(16)].map((_, i) => {
                const isMid = i % 4 === 2; const isQuarter = i % 4 === 0;
                return <div key={i} style={{ width: isMid ? '10px' : isQuarter ? '14px' : '6px', height: '1px', background: `rgba(251,191,36,${isMid ? 0.4 : isQuarter ? 0.6 : 0.18})`, borderRadius: '1px' }} />;
            })}
        </div>
        <div style={{ margin: '0 auto' }}><D20 size={20} opacity={0.5} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: '16px 0' }}>
            {[...Array(16)].map((_, i) => {
                const isMid = i % 4 === 1; const isQuarter = i % 4 === 3;
                return <div key={i} style={{ width: isMid ? '10px' : isQuarter ? '14px' : '6px', height: '1px', background: `rgba(251,191,36,${isMid ? 0.4 : isQuarter ? 0.6 : 0.18})`, borderRadius: '1px' }} />;
            })}
        </div>
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '12px', height: '1px', background: 'rgba(251,191,36,0.5)' }} />
            <div style={{ width: '6px', height: '6px', background: 'rgba(251,191,36,0.6)', transform: 'rotate(45deg)', boxShadow: '0 0 6px rgba(251,191,36,0.5)' }} />
            <div style={{ width: '12px', height: '1px', background: 'rgba(251,191,36,0.5)' }} />
        </div>
    </div>
);