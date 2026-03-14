export default function LanguageSelector({ activeLanguage, onSelect }) {
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'Hindi' },
        { code: 'ta', label: 'Tamil' },
        { code: 'te', label: 'Telugu' },
        { code: 'kn', label: 'Kannada' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            margin: '24px 0',
            justifyContent: 'center'
        }}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => onSelect(lang.code)}
                    style={{
                        padding: '8px 20px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: `1px solid ${activeLanguage === lang.code ? 'var(--color-maroon)' : 'rgba(107, 36, 33, 0.2)'}`,
                        backgroundColor: activeLanguage === lang.code ? 'var(--color-maroon)' : 'transparent',
                        color: activeLanguage === lang.code ? 'var(--color-light)' : 'var(--color-maroon)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
}
