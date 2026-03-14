export default function ShlokaText({ shloka }) {
    if (!shloka) return null;

    return (
        <div className="card fade-in" style={{ backgroundColor: '#fff', border: '1px solid rgba(107, 36, 33, 0.05)' }}>
            <h3 className="serif maroon text-center mb-4" style={{ fontSize: '1.5rem' }}>Today's Shloka</h3>

            <div style={{
                fontFamily: 'var(--font-sanskrit)',
                fontSize: '2rem',
                textAlign: 'center',
                marginBottom: '24px',
                lineHeight: '1.4',
                color: 'var(--color-dark)'
            }}>
                {shloka.sanskrit}
            </div>

            <div style={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: 'var(--color-muted)',
                marginBottom: '24px',
                fontSize: '1.1rem'
            }}>
                {shloka.transliteration}
            </div>

            <div style={{
                textAlign: 'center',
                fontSize: '1rem',
                padding: '0 20px',
                borderTop: '1px solid rgba(107, 36, 33, 0.1)',
                paddingTop: '24px'
            }}>
                {shloka.meaning}
            </div>
        </div>
    );
}
