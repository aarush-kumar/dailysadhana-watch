export default function ShlokaText({ shloka }) {
    if (!shloka) return null;

    return (
        <div className="fade-in" style={{
            backgroundColor: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-card)',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(30, 27, 19, 0.04)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative accent */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '128px',
                height: '128px',
                backgroundColor: 'rgba(254, 214, 91, 0.1)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)',
                filter: 'blur(40px)'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <span style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-gold)' }} />
                    <h3 style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: 'var(--color-gold)',
                        fontWeight: '800'
                    }}>
                        Today&apos;s Shloka
                    </h3>
                </div>

                {/* Sanskrit */}
                <div className="shloka-sanskrit" style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.75rem',
                    lineHeight: '1.6',
                    color: 'var(--color-maroon)',
                    fontWeight: '700',
                    fontStyle: 'italic',
                    marginBottom: '32px'
                }}>
                    {shloka.sanskrit}
                </div>

                {/* Transliteration */}
                {shloka.transliteration && (
                    <div style={{
                        backgroundColor: 'rgba(251, 243, 228, 0.5)',
                        padding: '20px 24px',
                        borderRadius: '8px',
                        borderLeft: '4px solid var(--color-gold)',
                        marginBottom: '24px'
                    }}>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontStyle: 'italic',
                            color: 'var(--color-muted)',
                            fontSize: '1rem',
                            lineHeight: '1.8'
                        }}>
                            {shloka.transliteration}
                        </p>
                    </div>
                )}

                {/* Meaning */}
                <div style={{
                    backgroundColor: 'rgba(242, 224, 203, 0.3)',
                    padding: '24px',
                    borderRadius: '8px'
                }}>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                        color: 'var(--color-dark)'
                    }}>
                        {shloka.meaning}
                    </p>
                </div>
            </div>

            <style jsx>{`
                .shloka-sanskrit {
                    text-align: center;
                }
                @media (min-width: 768px) {
                    .shloka-sanskrit {
                        text-align: left;
                        font-size: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
