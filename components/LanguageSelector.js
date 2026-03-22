export default function LanguageSelector({ activeLanguage, onSelect }) {
    const languages = [
        { code: 'en', label: 'ENGLISH' },
        { code: 'hi', label: 'HINDI' },
        { code: 'ta', label: 'TAMIL' },
        { code: 'te', label: 'TELUGU' },
        { code: 'kn', label: 'KANNADA' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            margin: '32px 0',
            overflow: 'auto'
        }}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => onSelect(lang.code)}
                    aria-pressed={activeLanguage === lang.code}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-label)',
                        letterSpacing: '0.1em',
                        border: 'none',
                        whiteSpace: 'nowrap',
                        backgroundColor: activeLanguage === lang.code ? 'var(--color-maroon)' : 'var(--surface-container-low)',
                        color: activeLanguage === lang.code ? 'white' : 'var(--color-muted)',
                        boxShadow: activeLanguage === lang.code ? '0 4px 12px rgba(93, 31, 31, 0.2)' : 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
