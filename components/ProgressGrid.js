import Link from 'next/link';

export default function ProgressGrid({ progress = [] }) {
    const totalDays = 90;

    return (
        <>
            <div className="progress-grid">
                {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const isWatched = progress.includes(dayNum);

                    return (
                        <Link
                            key={dayNum}
                            href={`/day/${dayNum}`}
                            className="progress-cell"
                            style={{
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: '600',
                                backgroundColor: isWatched ? 'var(--color-maroon)' : 'var(--surface-container-lowest)',
                                color: isWatched ? 'rgba(255,255,255,0.5)' : 'var(--color-muted)',
                                border: isWatched ? 'none' : '1px solid rgba(217, 193, 191, 0.3)',
                                boxShadow: isWatched
                                    ? '0 2px 6px rgba(93, 31, 31, 0.15)'
                                    : 'none',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}
                        >
                            {isWatched ? '✓' : dayNum}
                        </Link>
                    );
                })}
            </div>
            <style jsx>{`
                .progress-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                    max-width: 320px;
                    margin: 0 auto;
                }
                @media (min-width: 768px) {
                    .progress-grid {
                        grid-template-columns: repeat(10, 1fr);
                        gap: 12px;
                        max-width: 100%;
                    }
                }
            `}</style>
        </>
    );
}
