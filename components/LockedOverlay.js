export default function LockedOverlay() {
    return (
        <div className="fade-in" style={{
            padding: '60px 24px',
            backgroundColor: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-card)',
            boxShadow: '0 12px 48px rgba(30, 27, 19, 0.04)',
            textAlign: 'center',
            border: '2px dashed rgba(115, 92, 0, 0.2)'
        }}>
            <div style={{ fontSize: '48px', marginBottom: '24px' }}>🔒</div>
            <h2 style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-maroon)',
                fontSize: '1.5rem',
                marginBottom: '16px'
            }}>
                Locked for Journal Owners
            </h2>
            <p style={{
                color: 'var(--color-muted)',
                maxWidth: '400px',
                margin: '0 auto 32px',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.7'
            }}>
                This shloka experience is exclusively available for our community members who have purchased the Daily Sādhanā journal.
            </p>
            <a
                href="https://thedailysadhana.com/products/daily-sadhana-find-your-calm-in-just-5-minutes-a-day"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-block',
                    padding: '16px 40px',
                    backgroundColor: 'var(--color-maroon)',
                    color: 'white',
                    borderRadius: '9999px',
                    fontFamily: 'var(--font-label)',
                    fontWeight: '700',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(93, 31, 31, 0.2)',
                    transition: 'all 0.3s ease'
                }}
            >
                Get Your Journal
            </a>
        </div>
    );
}
